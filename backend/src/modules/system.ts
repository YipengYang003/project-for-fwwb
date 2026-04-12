/**
 * @file system.ts - 系统健康检查与状态路由模块
 * @description 提供系统级 API 端点，用于服务健康监测、版本查询和运行状态检查。
 *              主要供运维工具（如 Kubernetes liveness/readiness probe）调用。
 */

import { Router, Request, Response } from 'express'  // Express 路由和类型
import { prisma } from '../config/database'           // Prisma 数据库客户端

// 创建路由器实例
export const systemRouter = Router()

// ============================================
// 系统与健康检查路由
// ============================================

/**
 * GET / - API 根路由
 * 返回欢迎消息和 API 基本信息
 */
systemRouter.get('/', async (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),  // ISO 8601 格式时间戳
    documentation: '/api/docs',          // API 文档地址（待实现）
  })
})

/**
 * GET /health - 基础健康检查
 * 始终返回 OK，用于简单的存活检测（不检查依赖服务）
 */
systemRouter.get('/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

/**
 * GET /health/ready - 就绪检查（Readiness Probe）
 * 验证数据库连接是否正常，用于判断服务是否准备好接收请求
 * - 数据库正常 → 返回 200 + ready
 * - 数据库异常 → 返回 503 + not_ready
 */
systemRouter.get('/health/ready', async (_req: Request, res: Response) => {
  try {
    // 执行简单 SQL 查询（SELECT 1）验证数据库连接是否正常
    await prisma.$queryRaw`SELECT 1`

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',  // 数据库连接状态
      },
    })
  } catch (_error) {
    // 数据库连接失败，返回 503 Service Unavailable
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'disconnected',  // 数据库连接断开
      },
    })
  }
})

/**
 * GET /health/live - 存活检查（Liveness Probe）
 * 仅检查服务进程是否存活，不检查依赖服务
 * 用于 Kubernetes 等容器编排工具判断是否需要重启容器
 */
systemRouter.get('/health/live', async (_req: Request, res: Response) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  })
})

/**
 * GET /version - API 版本信息
 * 返回当前 API 版本、Node.js 版本和运行环境
 */
systemRouter.get('/version', async (_req: Request, res: Response) => {
  res.json({
    version: '1.0.0',                         // API 版本号
    apiVersion: 'v1',                           // API 版本标识
    nodeVersion: process.version,               // Node.js 运行时版本
    environment: process.env.NODE_ENV || 'development',  // 运行环境
    timestamp: new Date().toISOString(),
  })
})

/**
 * GET /ping - 简单的 ping/pong 端点
 * 用于快速检测服务是否响应
 */
systemRouter.get('/ping', async (_req: Request, res: Response) => {
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString(),
  })
})

/**
 * GET /status - 系统运行状态
 * 返回服务运行时长、内存使用情况和进程信息，用于监控和调试
 */
systemRouter.get('/status', async (_req: Request, res: Response) => {
  // 获取 Node.js 进程内存使用信息
  const memoryUsage = process.memoryUsage()

  res.json({
    status: 'operational',
    uptime: process.uptime(),  // 服务运行时长（秒）
    timestamp: new Date().toISOString(),
    // 内存使用详情（单位：MB）
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,                   // 常驻内存
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,       // V8 堆总大小
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,         // V8 堆已使用
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,         // 外部内存（C++ 对象等）
    },
    // 进程信息
    process: {
      pid: process.pid,               // 进程 ID
      platform: process.platform,     // 操作系统平台
      nodeVersion: process.version,   // Node.js 版本
    },
  })
})
