/**
 * @file PageTransition.tsx - 单页面过渡动画包装器
 * @description 为每个页面提供进入和退出动画效果。
 *              支持 4 种预定义过渡模式：fade（淡入淡出）、slide-up（上滑）、slide-fade（侧滑）、scale（缩放）。
 *
 *              ⚠️ 重要：
 *              - 此组件仅包裹页面内容区域，不包含 Navbar/Header/Sidebar
 *              - Navbar 必须在 AnimatedRoutes 外部渲染
 */

import { motion } from "./MotionPrimitives";  // 导入自定义的 motion 组件

/**
 * variants - 预定义的页面过渡动画变体
 * 每种变体定义了 initial（初始/退出状态）和 animate（进入状态）
 */
const variants = {
  /** fade：纯透明度淡入淡出 */
  fade: {
    initial: { opacity: 0 },      // 退出/初始：完全透明
    animate: { opacity: 1 },       // 进入：完全可见
    exit: { opacity: 0 },          // 退出：淡出
  },
  /** slide-up：从下方滑入 + 淡入 */
  "slide-up": {
    initial: { opacity: 0, y: 16 },      // 初始：透明 + 向下偏移 16px
    animate: { opacity: 1, y: 0 },        // 进入：可见 + 归位
    exit: { opacity: 0, y: -8 },          // 退出：淡出 + 向上偏移 8px
  },
  /** slide-fade：从右侧滑入 + 淡入 */
  "slide-fade": {
    initial: { opacity: 0, x: 12 },       // 初始：透明 + 向右偏移 12px
    animate: { opacity: 1, x: 0 },         // 进入：可见 + 归位
    exit: { opacity: 0, x: -12 },          // 退出：淡出 + 向左偏移 12px
  },
  /** scale：缩放 + 淡入 */
  scale: {
    initial: { opacity: 0, scale: 0.98 },    // 初始：缩小到 98%
    animate: { opacity: 1, scale: 1 },        // 进入：正常大小
    exit: { opacity: 0, scale: 0.98 },        // 退出：缩小淡出
  },
};

/** TransitionMode - 过渡模式类型（variants 的键名） */
type TransitionMode = keyof typeof variants;

/** PageTransition 组件属性 */
interface PageTransitionProps {
  children: React.ReactNode;             // 页面内容
  transition?: TransitionMode;           // 过渡动画模式，默认 'fade'
}

/**
 * PageTransition - 页面过渡动画包装器
 * 动画参数优化：
 * - duration: 0.2s（缩短动画时长，配合 popLayout 更流畅）
 * - ease: 自定义贝塞尔曲线 [0.25, 0.1, 0.25, 1]（自然减速效果）
 * - layout: 启用布局动画，确保元素尺寸变化时也有平滑过渡
 */
export function PageTransition({ children, transition = "fade" }: PageTransitionProps) {
  // 根据过渡模式获取对应的动画变体
  const v = variants[transition];

  return (
    <motion.div
      layout                                          // 启用布局动画
      initial={v.initial}                             // 初始/退出状态
      animate={v.animate}                             // 进入状态
      exit={v.exit}                                   // 退出状态
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}  // 动画时间曲线
    >
      {children}
    </motion.div>
  );
}
