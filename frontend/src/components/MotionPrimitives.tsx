/**
 * @file MotionPrimitives.tsx - 动画组件工具库
 * @description 提供 Framer Motion 的预置动画变体（Variants）和可复用动画组件。
 *              包含：
 *              - 7 种动画变体（fadeUp/fadeDown/fadeIn/fadeLeft/fadeRight/scaleUp/blurIn）
 *              - 交错动画容器工厂（staggerContainer）
 *              - FadeIn 组件（视口触发的淡入动画）
 *              - Stagger 组件（子元素依次出现的交错动画）
 *              - HoverLift 组件（鼠标悬停时上浮效果）
 *
 *              所有组件使用 forwardRef 支持通过 ref 传递 DOM 引用。
 */

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';  // Framer Motion 动画库
import { forwardRef, type ReactNode } from 'react';                            // React 转发引用和子节点类型

// ── 共享动画缓动和弹簧配置 ──
// ease：贝塞尔缓动曲线，实现自然的减速效果
const ease = [0.25, 0.46, 0.45, 0.94] as const;
// springBounce：弹簧动画配置，用于按钮点击等交互反馈
const springBounce = { type: 'spring', damping: 20, stiffness: 300 } as const;

// ── 预定义动画变体（Variants） ──
// 每个变体包含 hidden（初始状态）和 visible（目标状态）两个关键帧

/** fadeUp：从下方淡入（最常用的入场动画） */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },                                           // 初始：透明 + 向下偏移 32px
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },     // 目标：完全显示 + 归位
};

/** fadeDown：从上方淡入 */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/** fadeIn：原地淡入（无位移） */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
};

/** fadeLeft：从左侧滑入 */
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

/** fadeRight：从右侧滑入 */
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

/** scaleUp：从小到大缩放淡入 */
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },                                       // 初始：缩小到 92%
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },   // 目标：正常大小
};

/** blurIn：模糊到清晰淡入（高级效果） */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)' },                              // 初始：模糊 12px
  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
};

// ── 交错动画容器工厂函数 ──
/**
 * staggerContainer - 创建子元素依次出现的父容器变体
 * @param stagger - 子元素之间的延迟间隔（秒），默认 0.1s
 * @param delay - 第一个子元素出现前的延迟（秒），默认 0s
 * @returns {Variants} 父容器动画变体
 *
 * 用法：将 staggerContainer 作为父元素的 variants，
 *       子元素各自设置动画变体，即可自动实现依次出现效果
 */
export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},  // 隐藏状态无特殊处理
  visible: {
    transition: {
      staggerChildren: stagger,  // 每个子元素间隔 stagger 秒出现
      delayChildren: delay,       // 延迟 delay 秒后开始第一个子元素动画
    },
  },
});

// ── 通用视口触发淡入组件 ──
/**
 * FadeIn 组件属性
 * @extends HTMLMotionProps<'div'> 继承 motion.div 的所有原生属性
 */
interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;        // 子元素
  variants?: Variants;        // 自定义动画变体，默认 fadeUp
  delay?: number;             // 延迟时间（秒），默认 0
  duration?: number;          // 动画时长（秒）
  className?: string;         // 自定义 CSS 类名
  once?: boolean;             // 是否只在首次进入视口时触发，默认 true
  amount?: number;            // 元素进入视口多少比例时触发（0-1），默认 0.2（20%）
}

/**
 * FadeIn - 视口触发的淡入动画组件
 * 当元素滚动进入视口时自动播放进入动画。
 * 基于 whileInView API 实现，支持自定义变体和延迟。
 */
export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, variants = fadeUp, delay = 0, duration, className, once = true, amount = 0.2, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={variants}                           // 动画变体
      initial="hidden"                               // 初始状态：hidden
      whileInView="visible"                          // 进入视口时切换到 visible 状态
      viewport={{ once, amount }}                    // 视口检测配置
      transition={delay || duration ? { delay, ...(duration ? { duration } : {}) } : undefined}
      className={className}
      {...props}                                     // 透传额外的 props
    >
      {children}
    </motion.div>
  ),
);
FadeIn.displayName = 'FadeIn';  // DevTools 中显示的组件名称

// ── 交错动画父容器组件 ──
/**
 * Stagger 组件属性
 */
interface StaggerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;        // 子元素（每个子元素应设置各自的 variants）
  stagger?: number;           // 子元素出现间隔（秒），默认 0.1
  delay?: number;             // 整体延迟（秒），默认 0
  className?: string;
  once?: boolean;
  amount?: number;
}

/**
 * Stagger - 交错动画父容器组件
 * 子元素将按顺序依次出现，形成瀑布流效果。
 * 每个子元素需设置自己的 variants（如 fadeUp）以配合父容器的 staggerChildren。
 */
export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, stagger = 0.1, delay = 0, className, once = true, amount = 0.15, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={staggerContainer(stagger, delay)}  // 交错动画容器变体
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
Stagger.displayName = 'Stagger';

// ── 悬停上浮卡片组件 ──
/**
 * HoverLift 组件属性
 */
interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: ReactNode;        // 子元素
  className?: string;
  lift?: number;              // 悬停上浮距离（px），默认 -4（向上浮 4px）
}

/**
 * HoverLift - 鼠标悬停时上浮效果的卡片组件
 * 组合了 fadeUp 入场动画和 whileHover 悬浮效果。
 * 常用于功能卡片、产品列表等场景。
 */
export const HoverLift = forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, className, lift = -4, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={fadeUp}                                           // 入场使用 fadeUp 变体
      whileHover={{ y: lift, transition: { duration: 0.25, ease: 'easeOut' } }}  // 悬停时向上浮起
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  ),
);
HoverLift.displayName = 'HoverLift';

// 重新导出 motion 和 springBounce，供其他组件直接使用
export { motion, springBounce };
