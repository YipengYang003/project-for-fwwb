/**
 * @file App.tsx - 应用根组件
 * @description 配置全局 Provider（React Query、TooltipProvider、BrowserRouter），
 *              定义所有页面路由和页面切换动画。
 *              是整个前端应用的顶层组件，负责：
 *              1. 初始化 React Query 客户端（数据请求缓存管理）
 *              2. 配置 React Router 路由表
 *              3. 渲染导航栏和页面内容区域
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // React Query：数据请求/缓存管理
import { BrowserRouter, Route } from 'react-router-dom';                   // React Router：前端路由
import { Toaster } from "@/components/ui/sonner";                          // Toast 通知组件
import { TooltipProvider } from "@/components/ui/tooltip";                // Tooltip 气泡提示 Provider
import { AnimatedRoutes } from "@/components/AnimatedRoutes";              // 页面切换动画容器
import { PageTransition } from "@/components/PageTransition";              // 单页面进入/退出动画包装器
import Navbar from "./components/layout/Navbar";                            // 顶部导航栏组件
import Index from "./pages/Index";                                          // 首页
import QA from "./pages/QA";                                                // AI 法律问答页
import Cases from "./pages/Cases";                                          // 案例检索页
import Documents from "./pages/Documents";                                  // 文书生成页
import Review from "./pages/Review";                                        // 合同审查页
import LawQuery from "./pages/LawQuery";                                    // 法规查询页
import Guide from "./pages/Guide";                                          // 维权指引页
import CalcPage from "./pages/Calculator";                                  // 诉讼费用计算页
import Encyclopedia from "./pages/Encyclopedia";                            // 法律百科页
import NotFound from "./pages/NotFound";                                    // 404 页面

/**
 * queryClient - React Query 客户端实例
 * 配置全局默认选项：
 * - staleTime: 数据在 60 秒内视为新鲜，不会自动重新请求
 * - gcTime: 未使用的数据缓存保留 5 分钟后自动清除
 * - retry: 请求失败后自动重试 1 次
 * - refetchOnWindowFocus/refetchOnReconnect: 禁用自动重新获取（减少不必要的请求）
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 新鲜时间：60 秒
      gcTime: 5 * 60 * 1000,         // 垃圾回收时间：5 分钟
      retry: 1,                        // 失败重试次数
      refetchOnWindowFocus: false,     // 窗口重新获得焦点时不自动刷新
      refetchOnReconnect: false,       // 网络重连时不自动刷新
    },
    mutations: {
      retry: 1,                        // 修改操作失败重试次数
    },
  },
});

/**
 * App - 根组件
 * Provider 嵌套顺序（从外到内）：
 * QueryClientProvider → TooltipProvider → BrowserRouter → Navbar + AnimatedRoutes
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {/* 导航栏放在 AnimatedRoutes 外部，避免页面切换时重新创建 */}
          <Navbar />
          <AnimatedRoutes>
            {/* 首页路由 - 使用 slide-up 动画效果 */}
            <Route path="/" data-genie-title="首页" data-genie-key="Home" element={<PageTransition transition="slide-up"><Index /></PageTransition>} />
            {/* AI 法律问答 */}
            <Route path="/qa" data-genie-title="AI法律问答" data-genie-key="QA" element={<PageTransition transition="fade"><QA /></PageTransition>} />
            {/* 案例检索 */}
            <Route path="/cases" data-genie-title="案例检索" data-genie-key="Cases" element={<PageTransition transition="fade"><Cases /></PageTransition>} />
            {/* 文书生成 */}
            <Route path="/documents" data-genie-title="文书生成" data-genie-key="Documents" element={<PageTransition transition="fade"><Documents /></PageTransition>} />
            {/* 合同审查 */}
            <Route path="/review" data-genie-title="合同审查" data-genie-key="Review" element={<PageTransition transition="fade"><Review /></PageTransition>} />
            {/* 法律法规查询 */}
            <Route path="/laws" data-genie-title="法律法规查询" data-genie-key="LawQuery" element={<PageTransition transition="fade"><LawQuery /></PageTransition>} />
            {/* 维权指引 */}
            <Route path="/guide" data-genie-title="维权指引" data-genie-key="Guide" element={<PageTransition transition="fade"><Guide /></PageTransition>} />
            {/* 诉讼费用计算 */}
            <Route path="/calculator" data-genie-title="诉讼费用计算" data-genie-key="Calculator" element={<PageTransition transition="fade"><CalcPage /></PageTransition>} />
            {/* 法律百科 */}
            <Route path="/encyclopedia" data-genie-title="法律百科" data-genie-key="Encyclopedia" element={<PageTransition transition="fade"><Encyclopedia /></PageTransition>} />
            {/* 404 兜底路由 - 必须放在所有自定义路由之后 */}
            <Route path="*" data-genie-key="NotFound" data-genie-title="Not Found" element={<PageTransition transition="fade"><NotFound /></PageTransition>} />
          </AnimatedRoutes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App
