/**
 * @file setup.ts - 测试环境全局配置
 * @description Jest/Vitest 测试套件的全局设置文件，在所有测试用例执行前后
 *              统一管理数据库连接和测试数据清理。
 *
 * 生命周期：
 * - beforeAll：测试开始前的数据库初始化（预留）
 * - afterEach：每个测试用例执行后清除所有表数据，保证测试隔离性
 * - afterAll：所有测试执行完毕后断开数据库连接，释放资源
 */

import { prisma } from '../config/database'

// 测试开始前的初始化（预留数据库 seed 等操作）
beforeAll(async () => {
  // Setup test database
})

// 所有测试完毕后断开数据库连接
afterAll(async () => {
  await prisma.$disconnect()
})

// 每个测试用例执行后清理所有表数据
// 遍历 Prisma Model，对每个模型调用 deleteMany() 清空数据
// 保证各测试用例之间不会互相影响
afterEach(async () => {
  // Clean up test data
  const deleteOperations = Object.values(prisma).filter(
    value => typeof value === 'object' && value !== null && 'deleteMany' in value
  )

  // 并行执行所有表的 deleteMany，提高清理速度
  await Promise.all(deleteOperations.map((model: any) => model.deleteMany()))
})
