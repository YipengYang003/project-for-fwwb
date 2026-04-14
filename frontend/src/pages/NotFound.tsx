/**
 * @file NotFound.tsx - 404 未找到页面
 * @description 当用户访问不存在的路由时显示的页面。
 *              包含错误日志记录和返回首页的链接。
 */

import { useLocation } from "react-router-dom";  // 获取当前路由位置
import { useEffect } from "react";                // 副作用钩子

/**
 * NotFound - 404 页面组件
 * 功能：
 * 1. 在控制台记录用户尝试访问的不存在路由（便于排查问题）
 * 2. 显示 404 错误提示和返回首页链接
 */
const NotFound = () => {
  // 获取当前路由路径
  const location = useLocation();

  // 每次路由变化时，在控制台输出错误日志
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    {/* 全屏居中布局 */}
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        {/* 404 大号标题 */}
        <h1
          className="font-bold"
          style={{ fontSize: 'var(--font-size-display)', marginBottom: 'var(--spacing-md)' }}
        >
          404
        </h1>
        {/* 错误描述 */}
        <p
          className="text-muted-foreground"
          style={{ fontSize: 'var(--font-size-headline)', marginBottom: 'var(--spacing-md)' }}
        >
          Oops! Page not found
        </p>
        {/* 返回首页链接 */}