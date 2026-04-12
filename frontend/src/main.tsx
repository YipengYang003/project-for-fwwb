/**
 * @file main.tsx - 前端应用入口文件
 * @description React 应用的挂载点，将根组件 App 渲染到 HTML 中的 #root 节点。
 *              同时引入全局样式文件 index.css。
 */

import {createRoot} from 'react-dom/client'  // React 18+ 的 createRoot API
import './index.css'                           // 全局样式（Tailwind CSS、CSS 变量等）
import App from './App.tsx'                     // 根组件

// 获取 HTML 中的挂载节点，创建 React 根并渲染应用
// 使用 createRoot API 支持 React 18 的并发特性（Concurrent Features）
createRoot(document.getElementById('root')!).render(<App />)
