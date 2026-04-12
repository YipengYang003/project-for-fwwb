/**
 * @file AnimatedRoutes.tsx - 页面切换动画容器
 * @description 包装 React Router 的 Routes 组件，添加 Framer Motion 的 AnimatePresence 支持。
 *              实现页面切换时的进入/退出过渡动画效果。
 *
 *              ⚠️ 重要：
 *              - Navbar/Header/Sidebar 必须放在 AnimatedRoutes 外部，否则每次路由切换都会重新创建
 *              - 使用 mode="popLayout" 模式，新旧页面同时动画（而非等待旧页面退出后再进入）
 */

import { Routes, useLocation } from "react-router-dom";  // React Router 路由和位置钩子
import { AnimatePresence } from "framer-motion";          // Framer Motion 动画存在管理器

/** AnimatedRoutes 组件属性 */
interface AnimatedRoutesProps {
  children: React.ReactNode;  // 子元素（Route 组件列表）
}

/**
 * AnimatedRoutes - 页面切换动画容器组件
 * 功能：
 * 1. 监听路由变化（useLocation）
 * 2. 使用 AnimatePresence 在路由切换时播放退出/进入动画
 * 3. 通过 key={location.pathname} 让 React 在路由变化时重新挂载组件
 */
export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  // 获取当前路由位置信息（路径、查询参数等）
  const location = useLocation();

  return (
    {/* mode="popLayout"：新页面立即进入，旧页面同时退出（比 "wait" 模式更流畅） */}
    <AnimatePresence mode="popLayout">
      {/* key 绑定当前路径，路径变化时触发组件卸载/挂载动画 */}
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
}
