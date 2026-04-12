/**
 * ============================================================================
 *  粒子背景动画组件 (Particles.tsx)
 * ============================================================================
 *
 * 【组件功能】
 *   基于 HTML5 Canvas 的粒子动画背景效果，渲染浮动的粒子点及其连线。
 *   常用于首页 Hero 区域的科技感视觉装饰。
 *
 * 【动画原理】
 *   1. 在全屏 Canvas 上渲染指定数量的粒子（带随机位置、速度、大小、透明度）
 *   2. 每帧更新粒子位置，超出边界时自动环绕到对侧
 *   3. 计算粒子间距离，距离 < 150px 的粒子对之间绘制半透明连线
 *   4. 使用 requestAnimationFrame 实现 60fps 流畅动画
 *
 * 【Props 说明】
 *   - count: 粒子数量，默认 50
 *   - color: 粒子颜色（rgba 格式），默认白色半透明
 *   - speed: 粒子移动速度，默认 0.5
 *   - size: 粒子最大半径，默认 2px
 *
 * 【性能考虑】
 *   - Canvas 全屏固定定位，pointerEvents: none 不阻碍交互
 *   - 粒子间距连线使用 O(n²) 遍历，大量粒子时可能影响性能
 *   - 组件卸载时自动取消动画帧和移除 resize 监听器
 * ============================================================================
 */

import { useEffect, useRef } from 'react';

/**
 * Particle: 单个粒子的数据结构
 * - x, y: 当前位置坐标
 * - vx, vy: 速度向量（每帧移动的像素数）
 * - radius: 粒子半径（像素）
 * - opacity: 透明度（0~1）
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

/**
 * ParticlesProps: 组件属性接口
 * - count: 粒子总数量
 * - color: 粒子颜色（rgba 格式，透明度部分会被替换为粒子自身的 opacity）
 * - speed: 粒子移动速度因子
 * - size: 粒子最大半径
 */
interface ParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 50,                                  // 默认 50 个粒子
  color = 'rgba(255, 255, 255, 0.8)',         // 默认白色
  speed = 0.5,                                 // 默认速度因子
  size = 2,                                    // 默认最大半径 2px
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);     // Canvas DOM 引用
  const particlesRef = useRef<Particle[]>([]);           // 粒子数组（使用 ref 避免重渲染）
  const animationRef = useRef<number>(0);                // requestAnimationFrame 的 ID（用于取消）

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * resizeCanvas - 调整 Canvas 尺寸并重新初始化粒子
     * Canvas 宽高设为窗口宽高，保证全屏覆盖
     */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();  // 尺寸变化后重新生成粒子
    };

    /**
     * initParticles - 初始化粒子数组
     * 在 Canvas 范围内随机生成指定数量的粒子
     * 每个粒子具有随机位置、速度方向、大小和透明度
     */
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,         // 随机 X 坐标
          y: Math.random() * canvas.height,        // 随机 Y 坐标
          vx: (Math.random() - 0.5) * speed,      // 随机水平速度（正负方向）
          vy: (Math.random() - 0.5) * speed,      // 随机垂直速度（正负方向）
          radius: Math.random() * size,            // 随机半径（0 ~ size）
          opacity: Math.random() * 0.5 + 0.3,     // 随机透明度（0.3 ~ 0.8）
        });
      }
    };

    /**
     * drawParticles - 动画主循环
     * 每帧执行：更新位置 → 边界环绕 → 绘制粒子 → 绘制连线 → 请求下一帧
     */
    const drawParticles = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ─── 更新和绘制每个粒子 ───────────────────────────────────────────
      particlesRef.current.forEach((particle) => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界环绕：超出左边界 → 从右边进入，反之亦然
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // 绘制粒子（圆形，使用粒子自身的透明度）
        ctx.fillStyle = color.replace('0.8', particle.opacity.toString());
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ─── 绘制粒子间的连线 ─────────────────────────────────────────────
      // 距离 < 150px 的粒子对之间绘制半透明连线
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.forEach((p2, j) => {
          if (i < j) {  // 避免重复计算（i<j 保证每对只算一次）
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 距离小于 150px 时绘制连线，透明度随距离衰减
            if (distance < 150) {
              ctx.strokeStyle = color.replace('0.8', (0.1 * (1 - distance / 150)).toString());
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      });

      // 请求下一帧动画
      animationRef.current = requestAnimationFrame(drawParticles);
    };

    // 初始化并启动动画
    resizeCanvas();
    drawParticles();

    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);

    // 清理函数：组件卸载时移除监听器和取消动画
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, color, speed, size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',      // 固定定位，覆盖整个视口
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',  // 不阻碍鼠标/触摸事件穿透
        ...style,
      }}
    />
  );
};
