/**
 * ============================================================================
 *  打字机效果组件 (TypeWriter.tsx)
 * ============================================================================
 *
 * 【组件功能】
 *   模拟打字机逐字显示文本的动画效果，常用于 Hero 区域的标题或副标题。
 *   打字完成后闪烁光标自动消失。
 *
 * 【动画原理】
 *   1. 使用 useEffect 监听 displayedText 状态变化
 *   2. 每次更新时，通过 setTimeout 延迟后追加下一个字符
 *   3. 首次打字时额外加上 delay 延迟（用于页面加载后的等待）
 *   4. 所有字符显示完毕后，设置 isComplete = true，光标停止闪烁
 *
 * 【Props 说明】
 *   - text: 要显示的完整文本
 *   - speed: 每个字符的打字间隔（毫秒），默认 50ms
 *   - delay: 开始打字前的等待时间（毫秒），默认 0ms
 *   - cursor: 是否显示闪烁光标，默认 true
 *
 * 【注意事项】
 *   - 文本变化时会重新开始打字动画
 *   - 清理函数中清除 setTimeout，防止组件卸载后仍执行更新
 * ============================================================================
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TypeWriterProps: 组件属性接口
 * - text: 完整的目标文本
 * - speed: 每个字符的打字间隔（毫秒）
 * - delay: 打字开始前的等待时间（毫秒）
 * - cursor: 是否在打字过程中显示闪烁光标
 */
interface TypeWriterProps {
  text: string;
  speed?: number;     // 每个字符间隔（ms）
  delay?: number;     // 开始前延迟（ms）
  cursor?: boolean;   // 是否显示光标
  className?: string;
  style?: React.CSSProperties;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  speed = 50,         // 默认每个字符间隔 50ms
  delay = 0,          // 默认无延迟
  cursor = true,      // 默认显示光标
  className = '',
  style = {},
}) => {
  const [displayedText, setDisplayedText] = useState('');  // 当前已显示的文本
  const [isComplete, setIsComplete] = useState(false);     // 打字是否完成

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (displayedText.length < text.length) {
      // 还有字符未显示：设置定时器追加下一个字符
      timeout = setTimeout(() => {
        // 截取 text 的前 N+1 个字符作为新的显示文本
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, displayedText.length === 0 ? delay + speed : speed);
      // 首个字符：delay + speed（等待 delay 后再开始打字）
      // 后续字符：speed（正常打字速度）
    } else {
      // 所有字符已显示完毕
      setIsComplete(true);
    }

    // 组件卸载或依赖变化时清除定时器，防止内存泄漏
    return () => clearTimeout(timeout);
  }, [displayedText, text, speed, delay]);

  return (
    <motion.span
      initial={{ opacity: 0 }}              // 初始不可见
      animate={{ opacity: 1 }}              // 淡入显示
      transition={{ duration: 0.5 }}
      className={className}
      style={style}
    >
      {displayedText}
      {/* 闪烁光标：仅在打字过程中显示，打字完成后自动消失 */}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}              // 透明度在 1~0 之间循环
          transition={{ duration: 0.6, repeat: Infinity }}  // 无限重复
          style={{ marginLeft: 2 }}
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};
