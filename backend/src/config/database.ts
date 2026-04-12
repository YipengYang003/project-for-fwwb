/**
 * @file database.ts - Prisma 数据库客户端配置
 * @description 创建 PrismaClient 单例实例，确保开发环境下热重载不会创建多个连接。
 *              使用全局变量缓存策略，避免 Next.js/tsx 等开发工具的模块热替换问题。
 */

import { PrismaClient } from '@prisma/client'  // Prisma 生成的数据库客户端类
import { env } from './env'                     // 环境变量配置

/**
 * prismaClientSingleton - Prisma 客户端单例工厂函数
 * 开发环境启用 query/error/warn 日志，生产环境仅记录 error 日志
 * @returns {PrismaClient} 新的 Prisma 客户端实例
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    // 根据运行环境设置日志级别
    // 开发环境：记录所有 SQL 查询、错误和警告，便于调试
    // 生产环境：仅记录错误，减少日志输出
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// 在全局命名空间中声明 prisma 变量类型（用于开发环境缓存）
declare global {
  // globalThis.prisma 用于在热重载时保持同一个 Prisma 实例
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

/**
 * 导出 Prisma 客户端单例
 * - 如果全局已存在实例（热重载场景），复用已有实例
 * - 否则创建新实例并缓存到全局
 */
export const prisma = globalThis.prisma ?? prismaClientSingleton()

// 仅在非生产环境下将实例缓存到全局变量
// 防止开发工具（如 tsx、nodemon）热重载时重复创建数据库连接
if (env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// ── 优雅关闭 ──
// 进程退出前自动断开数据库连接，防止连接泄露
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
