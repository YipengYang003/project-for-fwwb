/**
 * @file system.test.ts - 系统 API 端点集成测试
 * @description 对系统模块（system.ts）的所有 API 端点进行集成测试。
 *              使用 supertest 库发送 HTTP 请求，验证响应状态码和 JSON 数据结构。
 *              涵盖 7 个系统级端点的健康检查、版本查询、运行状态等功能。
 *
 * 测试覆盖：
 * - GET /api/v1/health    → 基本健康检查（返回 ok）
 * - GET /api/v1/health/ready → 就绪检查（含数据库等子检查）
 * - GET /api/v1/health/live  → 存活检查（返回 alive）
 * - GET /api/v1/         → API 欢迎信息（含版本和时间戳）
 * - GET /api/v1/version  → 版本详细信息（含 Node 版本、运行环境）
 * - GET /api/v1/ping     → 简单的 pong 响应
 * - GET /api/v1/status   → 系统运行状态（含内存、进程、运行时间）
 */

import request from 'supertest'
import { createApp } from '../app'
import { env } from '../config/env'

// 通过工厂函数创建独立的 Express 应用实例（用于测试隔离）
const app = createApp()

describe('System API', () => {
  // ─── 基本健康检查端点 ──────────────────────────────────────────────────
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/health`).expect(200)

      expect(response.body.status).toBe('ok')
      expect(response.body.timestamp).toBeDefined()
    })
  })

  // ─── 就绪检查端点（用于 Kubernetes readiness probe）──────────────────────
  describe('GET /api/v1/health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/health/ready`)

      expect(response.body.status).toBeDefined()
      expect(response.body.timestamp).toBeDefined()
      expect(response.body.checks).toBeDefined()
    })
  })

  // ─── 存活检查端点（用于 Kubernetes liveness probe）───────────────────────
  describe('GET /api/v1/health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/health/live`).expect(200)

      expect(response.body.status).toBe('alive')
      expect(response.body.timestamp).toBeDefined()
    })
  })

  // ─── API 根路径欢迎信息 ────────────────────────────────────────────────
  describe('GET /api/v1/', () => {
    it('should return API welcome message', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/`).expect(200)

      expect(response.body.message).toBeDefined()
      expect(response.body.version).toBeDefined()
      expect(response.body.timestamp).toBeDefined()
    })
  })

  // ─── 版本详细信息端点 ──────────────────────────────────────────────────
  describe('GET /api/v1/version', () => {
    it('should return version information', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/version`).expect(200)

      expect(response.body.version).toBeDefined()
      expect(response.body.apiVersion).toBeDefined()
      expect(response.body.nodeVersion).toBeDefined()
      expect(response.body.environment).toBeDefined()
    })
  })

  // ─── 简单 ping/pong 端点 ──────────────────────────────────────────────
  describe('GET /api/v1/ping', () => {
    it('should return pong', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/ping`).expect(200)

      expect(response.body.message).toBe('pong')
      expect(response.body.timestamp).toBeDefined()
    })
  })

  // ─── 系统运行状态端点（含内存、进程信息）────────────────────────────────
  describe('GET /api/v1/status', () => {
    it('should return system status', async () => {
      const response = await request(app).get(`${env.API_PREFIX}/status`).expect(200)

      expect(response.body.status).toBe('operational')
      expect(response.body.uptime).toBeDefined()
      expect(response.body.memory).toBeDefined()
      expect(response.body.process).toBeDefined()
    })
  })
})
