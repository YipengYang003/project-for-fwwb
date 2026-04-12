/**
 * @file index.ts - 后端服务入口文件
 * @description 负责启动 Express 服务器，包括数据库连接、应用初始化和优雅关闭处理。
 *              这是整个后端服务的启动点，通过 createApp() 工厂函数创建 Express 实例。
 */

import { createApp } from './app'           // 导入 Express 应用工厂函数
import { env } from './config/env'           // 导入环境变量配置（经过 Zod 校验）
import { prisma } from './config/database'   // 导入 Prisma 数据库客户端单例
import { Prisma } from '@prisma/client'      // 导入 Prisma 错误类型，用于类型判断
import { logger } from './config/logger'     // 导入日志记录器

/**
 * startServer - 异步启动服务器
 * 流程：连接数据库（带重试机制） → 创建 Express 应用 → 监听端口
 */
const startServer = async () => {
  try {
    // 如果配置了数据库连接地址，则尝试连接数据库
    if (env.DATABASE_URL) {
      // 重试连接机制：最多重试 100 次，每次间隔 50ms（总计约 5 秒）
      // 仅对 PrismaClientInitializationError（数据库初始化错误）进行重试
      for (let i = 0;; i++) {
        try {
          await prisma.$connect()  // 尝试建立数据库连接
          break                      // 连接成功，退出重试循环
        }catch(e) {
          // 超过最大重试次数或非初始化错误，直接抛出异常
          if (i >= 100 || !(e instanceof Prisma.PrismaClientInitializationError)) {
            throw e
          }
          // 等待 50ms 后重试（数据库容器可能还在启动中）
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }
    }

    // 创建 Express 应用实例（配置中间件、路由等）
    const app = createApp()

    // 启动 HTTP 服务器，监听指定端口
    app.listen(env.PORT, () => {
      // 仅在开发环境下打印启动信息，避免生产环境日志污染
      if (env.NODE_ENV === 'development') {
        console.log(`Server running on http://localhost:${env.PORT}${env.API_PREFIX}`)
      }
    })
  } catch (error) {
    // 服务器启动失败，记录错误日志并以非零状态码退出
    logger.error({ err: error }, 'Failed to start server')
    process.exit(1)
  }
}

// ── 优雅关闭（Graceful Shutdown）处理 ──
// 当收到 SIGTERM（kill 命令）或 SIGINT（Ctrl+C）信号时，断开数据库连接后退出
process.on('SIGTERM', async () => {
  await prisma.$disconnect()  // 断开 Prisma 数据库连接
  process.exit(0)             // 正常退出进程
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()  // 断开 Prisma 数据库连接
  process.exit(0)             // 正常退出进程
})

// 调用启动函数，开始运行服务器
startServer()
