/**
 * @file validation.ts - Zod Schema 校验中间件
 * @description Express 中间件工厂函数，接收一个 Zod Schema 对象，
 *              在请求到达路由处理器之前，对 req.body 进行运行时类型校验。
 *              校验失败时将 ZodError 传递给全局错误处理中间件。
 *
 * 使用示例：
 *   router.post('/users', validate(createUserSchema), userController.create)
 */

import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

/**
 * validate - 校验中间件工厂函数
 * @param schema - Zod 校验 Schema，定义请求体的数据结构和类型
 * @returns Express 中间件函数，校验 req.body 是否符合 Schema
 *
 * 工作流程：
 * 1. 接收请求后，调用 schema.parseAsync() 异步校验 req.body
 * 2. 校验通过：调用 next() 将控制权传递给下一个中间件/路由
 * 3. 校验失败：Zod 抛出 ZodError，被 catch 捕获后传递给全局错误处理器
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // 使用 parseAsync 进行异步校验，支持异步 refinements
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      // 将 ZodError 传递给全局错误处理中间件（errorHandler.ts）统一处理
      next(error)
    }
  }
}
