/**
 * @file app.ts - Express 应用工厂函数
 * @description 创建并配置 Express 应用实例，包括中间件注册、CORS 配置、路由挂载和错误处理。
 *              使用工厂模式便于测试时创建独立的应用实例。
 */

import express, { Application } from 'express'  // Express 框架及类型
import cors from 'cors'                            // 跨域资源共享中间件
import compression from 'compression'              // HTTP 响应压缩中间件（gzip）
import 'express-async-errors'                      // 自动捕获异步路由中的错误
import { env } from './config/env'                 // 环境变量配置
import { errorHandler } from './middleware/errorHandler'  // 全局错误处理中间件
import { httpLogger } from './middleware/logger'          // HTTP 请求日志中间件
import { systemRouter } from './modules/system'           // 系统健康检查路由

// ============================================
// 在此添加业务模块路由导入
// ============================================
// 示例：import { productRouter } from './modules/product.js'

/**
 * createApp - 创建并返回配置好的 Express 应用实例
 * @returns {Application} 配置完成的 Express 应用
 *
 * 中间件执行顺序：
 * 1. HTTP 请求日志（记录每个请求）
 * 2. CORS 跨域处理
 * 3. JSON/URL 编码请求体解析
 * 4. 响应压缩
 * 5. 业务路由处理
 * 6. 全局错误处理
 */
export const createApp = (): Application => {
  // 创建 Express 应用实例
  const app = express()

  // 注册 HTTP 请求日志中间件（仅记录错误请求，静默成功请求）
  app.use(httpLogger)

  // 配置跨域资源共享（CORS）
  app.use(
    cors({
      // CORS_ORIGIN 为 '*' 时允许所有来源，否则按配置的源进行限制
      origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN,
      // 当限制特定来源时启用凭据支持（Cookie、Authorization 头等）
      credentials: env.CORS_ORIGIN !== '*',
    })
  )

  // 解析 JSON 格式的请求体（限制大小由 express.json() 默认值控制）
  app.use(express.json())
  // 解析 URL 编码格式的请求体（extended: true 支持嵌套对象）
  app.use(express.urlencoded({ extended: true }))
  // 启用 gzip 压缩，减小响应体积，提升传输速度
  app.use(compression())

  // ── API 路由注册 ──
  // 系统路由：健康检查、版本信息等（挂载在 API 前缀下）
  app.use(env.API_PREFIX, systemRouter)

  // ============================================
  // 在此添加业务模块路由
  // ============================================
  // 示例：app.use(`${env.API_PREFIX}/products`, productRouter)

  // ── 全局错误处理中间件（必须放在所有路由之后） ──
  // 捕获路由中抛出的所有未处理错误，返回统一的错误响应格式
  app.use(errorHandler)

  return app
}
