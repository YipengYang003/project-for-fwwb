/**
 * ============================================================================
 *  API 客户端模块 (api-client.ts)
 * ============================================================================
 *
 * 【模块功能】
 *   基于 Axios 的 HTTP 客户端，封装了所有与后端 API 的通信逻辑。
 *   包括请求拦截器（自动附加认证 Token）、响应拦截器（统一错误处理）。
 *
 * 【配置说明】
 *   - baseURL: '/api'，使用 Vite 代理转发到后端（无需配置环境变量）
 *   - timeout: 10000ms（10 秒超时）
 *   - Content-Type: application/json（默认 JSON 格式）
 *
 * 【拦截器】
 *   - 请求拦截器：从 localStorage 读取 auth_token 附加到 Authorization 头
 *   - 响应拦截器：处理 401（清除 Token）、403（权限不足）、500（服务器错误）
 *
 * 【导出】
 *   - apiClient: Axios 实例（默认导出）
 *   - getErrorMessage(): 类型安全的错误消息提取函数
 * ============================================================================
 */

import axios, { AxiosError } from 'axios';

/**
 * Axios 实例 - API 请求客户端
 * 使用 Vite 代理将 /api 请求转发到 http://localhost:3000
 * 无需配置 VITE_API_BASE_URL 环境变量
 */
export const apiClient = axios.create({
  baseURL: '/api',            // 请求基础路径（通过 Vite proxy 转发）
  timeout: 10000,             // 请求超时时间：10 秒
  headers: {
    'Content-Type': 'application/json',  // 默认请求体格式为 JSON
  },
});

/**
 * 请求拦截器 - 自动附加认证 Token
 * 从 localStorage 读取 auth_token，如果存在则添加到请求头 Authorization 中
 * 格式：Bearer <token>
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 统一处理常见 HTTP 错误
 * 401：未授权 → 清除本地 Token（可扩展为跳转登录页）
 * 403：禁止访问 → 输出错误日志
 * 500：服务器内部错误 → 输出错误日志
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 Unauthorized - 清除认证 Token
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // 取消注释以启用登录页跳转（当前为演示版，无需登录）
      // window.location.href = '/login';
    }

    // 403 Forbidden - 权限不足
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // 500 Internal Server Error - 服务器错误
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

/**
 * getErrorMessage - 类型安全的错误消息提取函数
 * @param error - 未知类型的错误对象（AxiosError | Error | unknown）
 * @returns 人类可读的错误消息字符串
 *
 * 提取优先级：
 * 1. Axios 错误 → 从 response.data.message 提取（后端返回的错误消息）
 * 2. 标准 Error → 从 error.message 提取
 * 3. 未知类型 → 返回默认错误消息
 */
export function getErrorMessage(error: unknown): string {
  // 判断是否为 Axios 错误（包含 response 属性）
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  // 判断是否为标准 Error 对象
  if (error instanceof Error) {
    return error.message;
  }
  // 兜底：未知类型错误
  return 'An unknown error occurred';
}

export default apiClient;
