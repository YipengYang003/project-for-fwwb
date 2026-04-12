/**
 * @file env.ts - 环境变量配置与校验
 * @description 使用 Zod 库对环境变量进行类型安全的运行时校验。
 *              加载 .env 文件后，通过预定义的 Schema 验证每个变量的格式和类型，
 *              校验失败时直接退出进程，防止应用在错误配置下运行。
 */

import dotenv from 'dotenv'  // 从 .env 文件加载环境变量到 process.env
import { z } from 'zod'       // TypeScript 优先的运行时类型校验库

// 加载 .env 文件中的环境变量到 process.env（仅加载一次）
dotenv.config()

/**
 * 环境变量校验 Schema
 * 使用 Zod 定义每个环境变量的类型、默认值和校验规则：
 * - z.enum()：限制为特定枚举值
 * - z.string().transform()：字符串类型转换
 * - z.string().url()：验证 URL 格式
 * - z.string().refine()：自定义校验逻辑
 * - .default()：提供默认值
 */
const envSchema = z.object({
  // 运行环境：development（开发）/ production（生产）/ test（测试），默认 development
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // 服务端口号：字符串转数字，默认 3000
  PORT: z.string().transform(Number).default('3000'),
  // API 路由前缀，默认 '/api'（所有路由均挂载在此前缀下）
  API_PREFIX: z.string().default('/api'),
  // 数据库连接 URL（PostgreSQL），可选配置（无数据库时跳过连接）
  DATABASE_URL: z.string().url().optional(),
  // CORS 允许的来源，默认 '*'（允许所有来源）
  // 自定义校验：必须是合法 URL 或 '*' 通配符
  CORS_ORIGIN: z.string().refine(
    (val) => val === '*' || z.string().url().safeParse(val).success,
    { message: 'CORS_ORIGIN must be a valid URL or "*" for all origins' }
  ).default('*'),
  // 限流时间窗口（毫秒），默认 15 分钟（900000ms）
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  // 限流时间窗口内最大请求数，默认 100 次
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
})

/**
 * parseEnv - 解析并校验环境变量
 * @returns {z.infer<typeof envSchema>} 校验通过的环境变量对象
 * @throws 校验失败时打印错误信息并以非零状态码退出
 */
const parseEnv = () => {
  try {
    // 使用 Schema 解析 process.env，自动应用类型转换和默认值
    return envSchema.parse(process.env)
  } catch (error) {
    // 校验失败：打印详细错误信息并退出进程
    console.error('❌ Invalid environment variables:', error)
    process.exit(1)
  }
}

// 导出校验通过的环境变量对象，供其他模块使用
export const env = parseEnv()
