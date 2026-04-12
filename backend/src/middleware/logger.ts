/**
 * @file logger.ts - HTTP 请求日志中间件
 * @description 基于 pino-http 的 HTTP 请求日志中间件。
 *              采用"静默成功"策略：仅记录 4xx 和 5xx 错误请求，
 *              正常请求（2xx、3xx）不输出日志，减少日志噪音。
 */

import { pinoHttp } from 'pino-http'  // pino-http：将 HTTP 请求/响应自动记录为结构化日志
import { logger } from '../config/logger'  // 导入配置好的 Pino 日志记录器

/**
 * httpLogger - HTTP 请求日志中间件实例
 * 配置说明：
 * - autoLogging.ignore：忽略健康检查端点（/health、/ping），避免刷日志
 * - customLogLevel：根据响应状态码动态设置日志级别
 *   - 4xx → warn（客户端错误）
 *   - 5xx 或有异常 → error（服务端错误）
 *   - 其他 → silent（静默，不记录）
 */
export const httpLogger = pinoHttp({
  logger,  // 使用主日志器实例
  // 自动日志配置：忽略特定路径的请求
  autoLogging: {
    ignore: req => {
      // 忽略健康检查和 ping 端点的日志记录
      return req.url?.startsWith('/health') || req.url === '/ping'
    },
  },
  // 根据响应状态码自定义日志级别
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'    // 4xx 客户端错误 → 警告级别
    } else if (res.statusCode >= 500 || err) {
      return 'error'   // 5xx 服务端错误或有异常 → 错误级别
    }
    return 'silent'    // 2xx/3xx 成功 → 静默（不记录日志）
  },
  // 成功请求的日志消息（仅错误请求会输出，成功时返回空字符串）
  customSuccessMessage: (req, res) => {
    if (res.statusCode >= 400) {
      return `${req.method} ${req.url} ${res.statusCode}`
    }
    return ''  // 成功请求不输出消息
  },
  // 错误请求的日志消息格式：方法 + 路径 + 错误描述
  customErrorMessage: (req, _res, err) => {
    return `${req.method} ${req.url} - ${err.message}`
  },
})
