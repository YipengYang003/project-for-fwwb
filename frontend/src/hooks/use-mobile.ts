/**
 * @file use-mobile.ts - 移动端设备检测 Hook
 * @description React 自定义 Hook，用于检测当前视口宽度是否属于移动端尺寸。
 *              基于 window.matchMedia API 监听视口变化，实现响应式布局的条件渲染。
 *              使用 CSS 媒体查询断点（默认 768px，即 Tailwind 的 md 断点）。
 *
 * 返回值：
 * - isMobile (boolean): true 表示当前为移动端视口（宽度 < 768px）
 *
 * 注意事项：
 * - 初始渲染时在客户端才会获取正确值，SSR 环境下默认为 undefined（后取反为 false）
 * - 使用 !! 确保始终返回 boolean 类型
 */

import * as React from "react"

// 移动端断点：768px（与 Tailwind CSS 的 md 断点一致）
const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile - 检测当前是否为移动端视口
 * @returns {boolean} 当前视口宽度是否小于 768px
 *
 * 实现原理：
 * 1. 使用 window.matchMedia 创建媒体查询监听器
 * 2. 监听 'change' 事件，在视口尺寸变化时更新状态
 * 3. 初始化时立即检测一次当前视口宽度
 * 4. 组件卸载时移除事件监听器，防止内存泄漏
 */
export function useIsMobile() {
  // 使用 undefined 作为初始值，避免 SSR 水合不匹配
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 创建媒体查询：视口宽度小于断点值
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    // 视口变化时的回调函数
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // 注册事件监听
    mql.addEventListener("change", onChange)
    // 初始化时立即检测
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // 组件卸载时移除监听器
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // 双重取反确保返回 boolean 类型（undefined → false）
  return !!isMobile
}
