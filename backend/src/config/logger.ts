/**
 * @file logger.ts - Pino 日志配置
 * @description 配置基于 Pino 的高性能 JSON 日志记录器。
 *              开发环境使用 pino-pretty 插件美化输出，生产环境输出纯 JSON 格式。
 */

import pino from 'pino'  // 高性能 Node.js 日志库

// 判断是否为开发环境
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * logger - 日志记录器实例
 * - level: 日志级别，默认 'warn'（仅记录警告及以上级别，成功请求不记录）
 * - transport: 开发环境使用 pino-pretty 美化输出（彩色、时间格式化、隐藏 pid）
 * - timestamp: 生产环境禁用时间戳（减少日志体积）
 * - serializers: 使用 Pino 标准错误序列化器（提取错误堆栈、消息等）
 */
export const logger = pino({
  // 日志级别：warn 级别，过滤掉 info/debug 级别的成功日志
  level: process.env.LOG_LEVEL || 'warn',
  // 开发环境配置美化输出
  transport: isDevelopment
    ? {
        // 使用 pino-pretty 插件美化日志输出
        target: 'pino-pretty',
        options: {
          colorize: true,               // 启用彩色输出
          translateTime: 'HH:MM:ss',    // 时间格式化为 时:分:秒
          ignore: 'pid,hostname',        // 隐藏进程 ID 和主机名
          messageFormat: '{msg}',        // 仅显示消息内容
        },
      }
    : undefined,  // 生产环境不使用 transport（输出纯 JSON）
  // 生产环境禁用时间戳字段（减少日志体积）
  timestamp: false,
  // 错误序列化器：使用 Pino 内置的标准序列化器
  serializers: {
    err: pino.stdSerializers.err,  // 序列化 Error 对象（提取 stack、message 等）
  },
})

/**
 * createLogger - 创建带有上下文信息的子日志器
 * @param context - 上下文名称，标识日志来源（如 'UserController', 'SystemController'）
 * @returns {pino.Logger} 带有 context 字段的子日志器
 * @example
 *   const log = createLogger('UserService')
 *   log.info('User created')  // 输出: { context: 'UserService', msg: 'User created', level: 30 }
 */
export function createLogger(context: string) {
  return logger.child({ context })
}
