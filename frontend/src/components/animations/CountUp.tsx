/**
 * ============================================================================
 *  数字递增动画组件 (CountUp.tsx)
 * ============================================================================
 *
 * 【组件功能】
 *   当元素进入视口时，数字从 0 递增到目标值，产生动态计数效果。
 *   常用于首页统计数据的展示（如"已服务 10,000+ 用户"）。
 *
 * 【动画原理】
 *   1. 使用 IntersectionObserver 监听元素是否进入视口
 *   2. 进入视口后启动 setInterval 定时器（约 60fps，每 16ms 更新一次）
 *   3. 根据经过时间和总时长计算当前进度 progress（0~1）
 *   4. 将 progress 线性映射到目标值，实现平滑递增
 *
 * 【Props 说明】
 *   - value: 目标数值
 *   - duration: 动画持续时间（秒），默认 2.5s
 *   - suffix: 数值后缀（如"+"、"%"、"万"）
 *   - prefix: 数值前缀（如"¥"、"$"）
 *   - decimals: 小数位数，默认 0（整数）
 *   - className/style: 样式定制
 * ============================================================================
 */

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * CountUpProps: 组件属性接口
 * - value: 目标数值（动画结束时应显示的数字）
 * - duration: 动画持续时间（秒），默认 2.5
 * - suffix: 数字后缀文本（如 "+"、"%"）
 * - prefix: 数字前缀文本（如 "¥"）
 * - decimals: 保留小数位数，默认 0
 */
interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 2.5,     // 默认动画时长 2.5 秒
  suffix = '',        // 默认无后缀
  prefix = '',        // 默认无前缀
  decimals = 0,       // 默认显示整数
  className = '',
  style = {},
}) => {
  const [count, setCount] = useState(0);          // 当前显示的数值
  const ref = useRef<HTMLDivElement>(null);       // DOM 引用，用于 IntersectionObserver

  useEffect(() => {
    let isVisible = false;  // 防止重复触发的标志

    // 创建交叉观察器，监听元素是否进入视口
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;     // 标记为已可见，防止重复触发
        animateCount();       // 启动数字递增动画
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    /**
     * animateCount - 数字递增动画核心函数
     * 使用 setInterval 每 16ms（约 60fps）更新一次数值
     * 通过线性插值计算当前帧应显示的数值
     */
    const animateCount = () => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        // 计算已经过的时间（秒）
        const elapsed = (Date.now() - startTime) / 1000;
        // 计算进度百分比（0~1），使用 Math.min 限制最大值为 1
        const progress = Math.min(elapsed / duration, 1);
        // 线性插值计算当前值，保留指定小数位数
        setCount(Math.floor(value * progress * (10 ** decimals)) / (10 ** decimals));

        // 动画完成：清除定时器
        if (progress === 1) {
          clearInterval(interval);
        }
      }, 16);  // 约 60fps
    };

    // 组件卸载时断开观察器
    return () => observer.disconnect();
  }, [value, duration, decimals]);

  // 根据小数位数格式化显示值
  const displayValue =
    decimals > 0
      ? count.toFixed(decimals)     // 有小数：使用 toFixed 格式化
      : count.toString();            // 整数：直接转字符串

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}                    // 初始透明
      whileInView={{ opacity: 1 }}                // 进入视口时淡入
      viewport={{ once: true, amount: 0.5 }}      // 只触发一次，50% 可见时触发
      className={className}
      style={style}
    >
      {prefix}         {/* 前缀（如 ¥） */}
      {displayValue}   {/* 动态数字 */}
      {suffix}         {/* 后缀（如 +） */}
    </motion.div>
  );
};
