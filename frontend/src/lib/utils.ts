/**
 * @file utils.ts - 通用工具函数
 * @description 提供 Tailwind CSS 的 className 合并工具函数。
 *              将 clsx（条件性 className 拼接）和 tailwind-merge（Tailwind 类冲突解决）
 *              组合为单一的 cn() 函数，是 shadcn/ui 的标准工具函数。
 *
 * 使用场景：
 *   cn("px-4 py-2", isActive && "bg-blue-500", className)
 *   → 合并条件类名并解决 Tailwind 类冲突（如 "px-4 px-6" → "px-6"）
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn - className 合并工具函数
 * @param inputs - ClassValue 类型的可变参数，支持字符串、对象、数组等多种格式
 * @returns 合并去重后的 className 字符串
 *
 * 工作流程：
 * 1. clsx(): 将所有输入合并为一个 className 字符串（处理条件、数组等）
 * 2. twMerge(): 解决 Tailwind CSS 类名冲突（后者覆盖前者）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
