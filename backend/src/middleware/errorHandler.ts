/**
 * @file errorHandler.ts - 全局错误处理中间件
 * @description Express 全局错误处理中间件，统一捕获和处理各类错误。
 *              支持分类处理 Zod 校验错误、Prisma 数据库错误、应用自定义错误和未知错误，
 *              返回统一格式的 JSON 错误响应。
 */

import { Request, Response, NextFunction } from 'express'  // Express 类型定义
import { ZodError } from 'zod'                              // Zod 数据校验错误类
import { Prisma } from '@prisma/client'                      // Prisma 数据库错误类
import { createLogger } from '../config/logger'              // 导入日志创建工具

// 创建错误处理模块的日志器，上下文标识为 'ErrorHandler'
const logger = createLogger('ErrorHandler')

/**
 * AppError - 自定义应用错误类
 * 用于表示业务逻辑中可预期的错误（如资源未找到、权限不足等）
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param statusCode - HTTP 状态码（如 404、409）
   * @param message - 错误消息
   * @param isOperational - 是否为可预期的操作错误（默认 true），用于区分系统故障
   */
  constructor(
    public statusCode: number,      // HTTP 响应状态码
    public message: string,          // 错误描述信息
    public isOperational = true      // 标记为可预期错误（非系统故障）
  ) {
    super(message)
    // 修复 TypeScript 继承 Error 类的 prototype 链问题
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * errorHandler - 全局错误处理中间件
 * 必须注册在所有路由之后（4 个参数的形式标识为错误处理中间件）
 *
 * 错误处理优先级：
 * 1. Zod 校验错误 → 400 Bad Request（请求体格式不正确）
 * 2. Prisma 数据库错误 → 409/503（唯一约束冲突/资源未找到）
 * 3. 应用自定义错误（AppError）→ 对应状态码
 * 4. 未知错误 → 500 Internal Server Error
 *
 * @param err - 捕获的错误对象
 * @param req - Express 请求对象
 * @param res - Express 响应对象
 * @param _next - 下一个中间件（错误处理中不使用）
 */
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // ── 1. Zod 数据校验错误处理 ──
  // 当请求体/查询参数/路径参数未通过 Zod Schema 校验时触发
  if (err instanceof ZodError) {
    logger.warn(
      {
        method: req.method,       // HTTP 方法（GET/POST 等）
        url: req.url,             // 请求路径
        errors: err.errors,       // 校验错误详情数组
      },
      'Validation error'
    )

    // 返回 400 状态码，附带每个字段的校验错误信息
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),   // 错误字段路径（如 'body.email'）
        message: e.message,         // 错误描述
      })),
    })
  }

  // ── 2. Prisma 数据库错误处理 ──
  // 当数据库操作失败时触发（如唯一约束冲突、记录未找到等）
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(
      {
        method: req.method,
        url: req.url,
        code: err.code,  // Prisma 错误代码（如 P2002、P2025）
      },
      'Database error'
    )

    // P2002：唯一约束冲突（如重复的用户名/邮箱）
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'Resource already exists',
      })
    }
    // P2025：记录未找到（如查询不存在的 ID）
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found',
      })
    }
  }

  // ── 3. 应用自定义错误处理（AppError）──
  // 业务逻辑中主动抛出的可预期错误
  if (err instanceof AppError) {
    logger.warn(
      {
        method: req.method,
        url: req.url,
        statusCode: err.statusCode,
      },
      err.message
    )

    // 返回对应的状态码和错误消息
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  // ── 4. 未知错误处理（兜底） ──
  // 未被上述分类捕获的错误，返回 500 内部服务器错误
  logger.error(
    {
      err,                 // 完整错误对象（含堆栈）
      method: req.method,
      url: req.url,
    },
    'Unhandled error'
  )

  // 不向客户端暴露具体错误细节，避免信息泄露
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
