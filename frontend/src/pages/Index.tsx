/**
 * 首页组件 (Index.tsx)
 * 
 * 功能说明：
 * - 律智通法律助手平台的首页/落地页
 * - 展示平台核心功能、数据统计、用户操作引导
 * - 支持快速法律咨询和常见问题快捷访问
 * 
 * 主要模块：
 * 1. Hero 区域 - 主标题、咨询输入框、深度思考开关
 * 2. 数据统计区 - 展示案例库、AI准确率等数据
 * 3. 功能导航区 - 8大核心功能卡片
 * 4. 常见问题区 - 可点击的常见法律问题
 * 5. 使用步骤区 - 3步解决法律问题的流程
 * 6. 核心优势区 - 平台4大优势展示
 * 7. Footer - 版权信息和免责声明
 */

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  FileText,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Scale,
  ChevronRight,
  Navigation,
  Calculator,
  GraduationCap,
  Send,
  Brain,
  ChevronDown,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/animations/CountUp';
import { TypeWriter } from '@/components/animations/TypeWriter';
import { Particles } from '@/components/animations/Particles';
import { useState } from 'react';

/**
 * 功能模块配置数据
 * 每个功能项包含：图标、标题、描述、跳转路径、主题色
 */
const features = [
  {
    icon: MessageSquare,
    title: '智能咨询',
    desc: '7×24小时在线法律咨询，专业解答通俗易懂',
    to: '/qa',
    color: 'var(--theme-blue)',
  },
  {
    icon: Search,
    title: '案例检索',
    desc: '全国类案精准检索，参考司法裁判观点',
    to: '/cases',
    color: 'var(--theme-green)',
  },
  {
    icon: BookOpen,
    title: '法规查询',
    desc: '现行法律法规实时查询，权威法条支撑',
    to: '/laws',
    color: 'oklch(0.55 0.15 300)',
  },
  {
    icon: ShieldCheck,
    title: '合同审查',
    desc: '一键识别合同风险，提供专业修改建议',
    to: '/review',
    color: 'var(--theme-red)',
  },
  {
    icon: FileText,
    title: '文书生成',
    desc: '自动生成借条/合同/起诉状等常用法律文书',
    to: '/documents',
    color: 'var(--theme-gold)',
  },
  {
    icon: Navigation,
    title: '维权指引',
    desc: '劳动/租房/消费/工伤维权，手把手步骤教学',
    to: '/guide',
    color: 'oklch(0.55 0.18 145)',
  },
  {
    icon: Calculator,
    title: '费用计算',
    desc: '诉讼费、赔偿款、违约金一键精准计算',
    to: '/calculator',
    color: 'oklch(0.55 0.15 35)',
  },
  {
    icon: GraduationCap,
    title: '法律百科',
    desc: '法律术语白话解读，零基础轻松学法律',
    to: '/encyclopedia',
    color: 'oklch(0.55 0.15 75)',
  },
];

/**
 * 常见法律问题快捷问题列表
 * 用户点击后可快速跳转到AI问答页面获取解答
 */
const quickQuestions = [
  '试用期被辞退能要赔偿吗？',
  '租房押金不退怎么维权？',
  '朋友借钱不还没有借条怎么办？',
  '上下班途中车祸算工伤吗？',
  '网购质量问题如何投诉？',
  '劳动合同到期不续签有补偿吗？',
];

/**
 * 数据统计配置
 * 用于展示平台数据实力，CountUp 组件实现数字动画效果
 */
const stats = [
  { value: 800000, label: '法律案例库', suffix: '+', decimals: 0 },
  { value: 98.5, label: 'AI回答准确率', suffix: '%', decimals: 1 },
  { value: 600, label: '文书模板', suffix: '+', decimals: 0 },
  { value: 100000, label: '服务用户', suffix: '+', decimals: 0 },
];

/**
 * 使用步骤配置
 * 引导用户了解平台使用流程
 */
const steps = [
  {
    num: '01',
    icon: MessageSquare,
    title: '描述问题',
    desc: '用自然语言说明您的法律困扰',
  },
  {
    num: '02',
    icon: Lightbulb,
    title: '获取解答',
    desc: 'AI结合法条+案例给出专业建议',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: '工具辅助',
    desc: '用维权指引、费用计算等工具落地解决',
  },
];

/**
 * 首页主组件
 * 包含完整的首页布局和各功能区域
 */
export default function Index() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');          // 咨询问题输入
  const [deepThink, setDeepThink] = useState(false);      // 深度思考模式开关

  /**
   * 提交问题处理函数
   * 将问题编码后跳转到AI问答页面
   * 支持深度思考模式参数传递
   */
  const handleSubmit = () => {
    const q = question.trim();
    if (!q) return;
    // 编码问题参数并跳转，deep参数控制深度思考模式
    navigate(`/qa?q=${encodeURIComponent(q)}${deepThink ? '&deep=1' : ''}`);
  };

  /**
   * 键盘事件处理
   * 支持 Enter 键快速提交（Shift+Enter 换行）
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * 快捷问题点击处理
   * 跳转到问答页面并自动发送选中的问题
   */
  const handleQuickQuestion = (q: string) => {
    navigate(`/qa?q=${encodeURIComponent(q)}`);
  };

  /**
   * 滚动到快捷问题区域
   * 使用 smooth 滚动动画
   */
  const scrollToQuickQuestions = () => {
    const el = document.getElementById('quick-questions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* 动态粒子背景效果 */}
      <Particles count={40} color="rgba(248, 212, 58, 0.15)" speed={0.3} size={1.5} />

      {/* ── Hero 区域 ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--hero) 0%, oklch(0.28 0.08 255) 50%, oklch(0.25 0.05 245) 100%)',
          padding: 'var(--spacing-3xl) var(--spacing-lg)',
        }}
      >
        {/* 装饰性渐变圆形背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 右上角金色光晕 */}
          <div
            className="absolute rounded-full opacity-10"
            style={{
              width: 600,
              height: 600,
              top: -200,
              right: -150,
              background: 'radial-gradient(circle, var(--theme-gold) 0%, transparent 70%)',
            }}
          />
          {/* 左下角蓝色光晕 */}
          <div
            className="absolute rounded-full opacity-8"
            style={{
              width: 400,
              height: 400,
              bottom: -100,
              left: -100,
              background: 'radial-gradient(circle, var(--theme-blue) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* 平台标签徽章 */}
            <FadeIn>
              <div
                className="inline-flex items-center rounded-full border"
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  marginBottom: 'var(--spacing-lg)',
                  borderColor: 'oklch(1 0 0 / 15%)',
                  background: 'oklch(1 0 0 / 8%)',
                  gap: 'var(--spacing-xs)',
                }}
              >
                <Scale size={14} style={{ color: 'var(--theme-gold)' }} />
                <span
                  style={{
                    color: 'var(--hero-foreground)',
                    fontSize: 'var(--font-size-label)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  AI驱动的智慧法律服务平台
                </span>
              </div>
            </FadeIn>

            {/* 主标题 - 使用打字机效果 */}
            <FadeIn delay={0.1}>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, var(--font-size-display))',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--hero-foreground)',
                  lineHeight: 1.15,
                  marginBottom: 'var(--spacing-md)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                }}
              >
                <TypeWriter
                  text="用 AI 解决您的日常法律难题"
                  speed={70}
                  delay={300}
                  cursor={false}
                  style={{
                    background:
                      'linear-gradient(90deg, var(--hero-foreground) 0%, var(--theme-gold) 50%, var(--hero-foreground) 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                />
              </h1>
            </FadeIn>

            {/* 副标题 */}
            <FadeIn delay={0.2}>
              <p
                style={{
                  fontSize: 'var(--font-size-title)',
                  color: 'oklch(0.80 0.01 250)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--spacing-xl)',
                  maxWidth: 560,
                  marginInline: 'auto',
                }}
              >
                为个人、小微企业提供免费、专业、可落地的一站式法律服务
              </p>
            </FadeIn>

            {/* 咨询输入框区域 */}
            <FadeIn delay={0.3}>
              <div
                className="rounded-2xl border"
                style={{
                  background: 'oklch(1 0 0 / 6%)',
                  borderColor: 'oklch(1 0 0 / 15%)',
                  padding: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-md)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* 多行文本输入框 */}
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="请描述您的法律问题，例如：试用期被辞退怎么办、租房押金不退如何维权..."
                  rows={3}
                  className="w-full bg-transparent resize-none outline-none"
                  style={{
                    color: 'var(--hero-foreground)',
                    fontSize: 'var(--font-size-body)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--spacing-sm)',
                  }}
                />
                <div className="flex items-center justify-between flex-wrap" style={{ gap: 8 }}>
                  {/* 深度思考开关按钮 */}
                  <button
                    onClick={() => setDeepThink(!deepThink)}
                    className="flex items-center rounded-xl cursor-pointer transition-all"
                    style={{
                      gap: 6,
                      padding: '5px 10px',
                      background: deepThink
                        ? 'color-mix(in oklch, var(--theme-gold) 20%, transparent)'
                        : 'oklch(1 0 0 / 8%)',
                      border: deepThink
                        ? '1px solid color-mix(in oklch, var(--theme-gold) 50%, transparent)'
                        : '1px solid oklch(1 0 0 / 15%)',
                      color: deepThink ? 'var(--theme-gold)' : 'oklch(0.70 0.02 250)',
                      fontSize: 12,
                      fontWeight: deepThink ? 600 : 400,
                    }}
                  >
                    <Brain size={13} />
                    深度思考
                    {/* 自定义开关样式 */}
                    <div
                      style={{
                        width: 28, height: 16,
                        borderRadius: 999,
                        background: deepThink ? 'var(--theme-gold)' : 'oklch(1 0 0 / 20%)',
                        position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2,
                        left: deepThink ? 14 : 2,
                        width: 12, height: 12,
                        borderRadius: '50%',
                        background: 'white',
                        transition: 'left 0.2s',
                      }} />
                    </div>
                  </button>

                  {/* 提交按钮 */}
                  <button
                    onClick={handleSubmit}
                    disabled={!question.trim()}
                    className="inline-flex items-center rounded-xl cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--theme-gold)',
                      color: 'var(--accent-foreground)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--font-size-body)',
                      padding: 'var(--spacing-xs) var(--spacing-lg)',
                      gap: 'var(--spacing-xs)',
                    }}
                  >
                    立即咨询
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* CTA 操作按钮组 */}
            <FadeIn delay={0.4}>
              <div
                className="flex flex-col sm:flex-row items-center justify-center"
                style={{ gap: 'var(--spacing-md)' }}
              >
                <Link to="/qa">
                  <Button
                    size="lg"
                    className="cursor-pointer"
                    style={{
                      background: 'var(--theme-gold)',
                      color: 'var(--accent-foreground)',
                      fontWeight: 'var(--font-weight-semibold)',
                      fontSize: 'var(--font-size-body)',
                      padding: 'var(--spacing-sm) var(--spacing-xl)',
                      transition: 'var(--duration-fast) var(--ease-default)',
                    }}
                  >
                    立即咨询
                    <ArrowRight size={18} style={{ marginLeft: 'var(--spacing-xs)' }} />
                  </Button>
                </Link>
                <button
                  onClick={scrollToQuickQuestions}
                  className="inline-flex items-center cursor-pointer rounded-xl border transition-all"
                  style={{
                    borderColor: 'oklch(1 0 0 / 20%)',
                    color: 'var(--hero-foreground)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-body)',
                    padding: 'var(--spacing-sm) var(--spacing-xl)',
                    background: 'oklch(1 0 0 / 5%)',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  查看常见问题
                  <ChevronDown size={16} />
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 数据统计区域 ── */}
      <section
        className="border-b border-border"
        style={{
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          background: 'var(--card)',
        }}
      >
        <Stagger className="container">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'var(--spacing-lg)' }}>
            {stats.map((stat) => (
              <FadeIn key={stat.label} className="text-center">
                <div
                  className="font-bold text-primary"
                  style={{
                    fontSize: 'var(--font-size-headline)',
                    letterSpacing: 'var(--letter-spacing-tight)',
                    minHeight: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* CountUp 组件实现数字递增动画 */}
                  <CountUp
                    value={stat.value}
                    duration={2.5}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </div>
                <div
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--font-size-label)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  {stat.label}
                </div>
              </FadeIn>
            ))}
          </div>
        </Stagger>
      </section>

      {/* ── 8大功能导航区域 ── */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-lg)',
          background: 'var(--background)',
        }}
      >
        <div className="container">
          <FadeIn className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h2
              className="font-bold text-foreground"
              style={{
                fontSize: 'var(--font-size-headline)',
                marginBottom: 'var(--spacing-sm)',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              一站式法律服务平台
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--font-size-body)',
                maxWidth: 480,
                marginInline: 'auto',
              }}
            >
              覆盖法律工作全流程，8大核心工具一应俱全
            </p>
          </FadeIn>

          <Stagger
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: 'var(--spacing-lg)' }}
          >
            {features.map((f) => (
              <HoverLift key={f.title}>
                <Link
                  to={f.to}
                  className="flex flex-col border border-border rounded-xl bg-card cursor-pointer group"
                  style={{
                    padding: 'var(--spacing-lg)',
                    gap: 'var(--spacing-sm)',
                    transition: 'var(--duration-normal) var(--ease-default)',
                    boxShadow: 'var(--ds-shadow-sm)',
                    minHeight: 140,
                  }}
                >
                  {/* 功能图标 */}
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      background: `color-mix(in oklch, ${f.color} 12%, transparent)`,
                    }}
                  >
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>

                  {/* 标题和箭头 */}
                  <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                    <h3
                      className="font-semibold text-foreground"
                      style={{ fontSize: 'var(--font-size-body)' }}
                    >
                      {f.title}
                    </h3>
                    <ChevronRight
                      size={15}
                      className="text-muted-foreground group-hover:text-primary shrink-0"
                      style={{ transition: 'var(--duration-fast) var(--ease-default)' }}
                    />
                  </div>

                  {/* 功能描述 */}
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--font-size-label)',
                      lineHeight: 'var(--line-height)',
                    }}
                  >
                    {f.desc}
                  </p>
                </Link>
              </HoverLift>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 常见问题快捷入口区域 ── */}
      <section
        id="quick-questions"
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-lg)',
          background: 'var(--secondary)',
          scrollMarginTop: '80px',
        }}
      >
        <div className="container">
          <FadeIn className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h2
              className="font-bold text-foreground"
              style={{
                fontSize: 'var(--font-size-headline)',
                marginBottom: 'var(--spacing-sm)',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              常见法律问题
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--font-size-body)',
                maxWidth: 400,
                marginInline: 'auto',
              }}
            >
              点击问题直接获取AI专业解答
            </p>
          </FadeIn>

          <Stagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ gap: 'var(--spacing-md)' }}
          >
            {quickQuestions.map((q) => (
              <HoverLift key={q}>
                <button
                  onClick={() => handleQuickQuestion(q)}
                  className="w-full text-left flex items-center border border-border rounded-xl bg-card cursor-pointer group"
                  style={{
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    gap: 'var(--spacing-sm)',
                    transition: 'var(--duration-normal) var(--ease-default)',
                    boxShadow: 'var(--ds-shadow-sm)',
                  }}
                >
                  {/* 问题图标 */}
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      background:
                        'color-mix(in oklch, var(--theme-gold) 12%, transparent)',
                    }}
                  >
                    <MessageSquare size={15} style={{ color: 'var(--theme-gold)' }} />
                  </div>
                  {/* 问题文本 */}
                  <span
                    className="flex-1 font-medium text-foreground group-hover:text-primary"
                    style={{
                      fontSize: 'var(--font-size-body)',
                      transition: 'var(--duration-fast) var(--ease-default)',
                    }}
                  >
                    {q}
                  </span>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-muted-foreground group-hover:text-primary"
                    style={{ transition: 'var(--duration-fast) var(--ease-default)' }}
                  />
                </button>
              </HoverLift>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 使用步骤介绍区域 ── */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-lg)',
          background: 'var(--background)',
        }}
      >
        <div className="container">
          <FadeIn className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h2
              className="font-bold text-foreground"
              style={{
                fontSize: 'var(--font-size-headline)',
                marginBottom: 'var(--spacing-sm)',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              3步轻松解决法律问题
            </h2>
            <p
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--font-size-body)',
                maxWidth: 400,
                marginInline: 'auto',
              }}
            >
              简单、高效、专业，零法律基础也能快速上手
            </p>
          </FadeIn>

          <Stagger
            className="grid grid-cols-1 sm:grid-cols-3 relative"
            style={{ gap: 'var(--spacing-lg)' }}
          >
            {steps.map((step, idx) => (
              <FadeIn key={step.num} className="relative text-center">
                {/* 桌面端步骤间的连接线 */}
                {idx < steps.length - 1 && (
                  <div
                    className="hidden sm:block absolute top-10 left-[calc(50%+36px)] right-[calc(-50%+36px)] h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, var(--border), transparent)',
                      zIndex: 0,
                    }}
                  />
                )}
                <div
                  className="rounded-xl border border-border bg-card relative"
                  style={{
                    padding: 'var(--spacing-xl)',
                    boxShadow: 'var(--ds-shadow-sm)',
                    zIndex: 1,
                  }}
                >
                  {/* 步骤序号徽章 */}
                  <div
                    className="inline-flex items-center justify-center rounded-full font-bold mb-4"
                    style={{
                      width: 52,
                      height: 52,
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontSize: 'var(--font-size-label)',
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="font-semibold text-foreground"
                    style={{
                      fontSize: 'var(--font-size-title)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--font-size-label)',
                      lineHeight: 'var(--line-height)',
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 核心优势展示区域 ── */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-lg)',
          background: 'var(--secondary)',
        }}
      >
        <div className="container">
          <FadeIn className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h2
              className="font-bold text-foreground"
              style={{
                fontSize: 'var(--font-size-headline)',
                letterSpacing: 'var(--letter-spacing-tight)',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              智律通核心优势
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
              让每一个人都能用得上、看得懂、信得过的法律服务
            </p>
          </FadeIn>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--spacing-lg)' }}>
            {[
              {
                emoji: '⚖️',
                color: 'var(--theme-blue)',
                title: '专业可靠',
                desc: '基于法规与判例，拒绝 AI 幻觉，引用真实法条支撑每一条解答',
              },
              {
                emoji: '💬',
                color: 'var(--theme-green)',
                title: '简单易懂',
                desc: '白话解答，零基础也能看懂，法律不再是晦涩难懂的专业术语',
              },
              {
                emoji: '⚡',
                color: 'var(--theme-gold)',
                title: '高效便捷',
                desc: '一键检索、一键生成、一步维权，秒级响应解决法律难题',
              },
              {
                emoji: '🤝',
                color: 'oklch(0.55 0.18 145)',
                title: '免费普惠',
                desc: '面向大众提供基础法律服务，让普通人也能享有平等的法律保障',
              },
            ].map((item) => (
              <HoverLift key={item.title} lift={-4}>
                <div
                  className="rounded-2xl border border-border bg-card text-center"
                  style={{ padding: 'var(--spacing-xl)', boxShadow: 'var(--ds-shadow-sm)' }}
                >
                  {/* 优势图标 */}
                  <div
                    className="inline-flex items-center justify-center rounded-2xl"
                    style={{
                      width: 60,
                      height: 60,
                      fontSize: 28,
                      background: `color-mix(in oklch, ${item.color} 12%, transparent)`,
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    {item.emoji}
                  </div>
                  <h3
                    className="font-bold text-foreground"
                    style={{ fontSize: 'var(--font-size-title)', marginBottom: 'var(--spacing-xs)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: 'var(--font-size-label)', lineHeight: 1.7 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </HoverLift>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 页脚区域 ── */}
      <footer
        className="border-t border-border"
        style={{
          padding: 'var(--spacing-2xl) var(--spacing-lg)',
          background: 'var(--card)',
        }}
      >
        <div className="container">
          {/* 顶部：Logo + 版权信息 */}
          <div
            className="flex flex-col md:flex-row items-center justify-between"
            style={{ gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}
          >
            <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
              <Scale size={18} className="text-primary" />
              <span
                className="font-semibold text-foreground"
                style={{ fontSize: 'var(--font-size-body)' }}
              >
                智律通
              </span>
            </div>
            <p
              className="text-muted-foreground text-center"
              style={{ fontSize: 'var(--font-size-label)' }}
            >
              ©2026 智律通｜第十七届中国大学生服务外包创新创业大赛 D06 智慧法律赛道参赛作品
            </p>
          </div>

          {/* 技术支持信息 */}
          <div
            className="text-center border-t border-border"
            style={{ paddingTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}
          >
            <p
              className="text-muted-foreground"
              style={{ fontSize: 'var(--font-size-label)' }}
            >
              技术支持：腾讯元器 ｜ 得理开放平台 API ｜ 小理 AI
            </p>
          </div>

          {/* 免责声明 */}
          <div
            className="rounded-xl border border-border text-center"
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              background: 'color-mix(in oklch, var(--theme-gold) 5%, transparent)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            <p
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--font-size-small)',
                lineHeight: 1.7,
              }}
            >
              <span
                className="font-semibold"
                style={{ color: 'var(--theme-gold)', marginRight: '0.25rem' }}
              >
                免责声明：
              </span>
              本平台为智能辅助工具，所有内容仅供参考，不构成法律意见。涉及重大法律权益，请务必咨询专业律师。
            </p>
          </div>

          {/* 底部链接 */}
          <div className="flex items-center justify-center" style={{ gap: 'var(--spacing-lg)' }}>
            {['隐私政策', '服务条款', '问题反馈'].map((item, idx) => (
              <span key={item} className="flex items-center" style={{ gap: 'var(--spacing-lg)' }}>
                <button
                  className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  style={{ fontSize: 'var(--font-size-small)' }}
                >
                  {item}
                </button>
                {/* 分隔符（最后一项后不显示） */}
                {idx < 2 && (
                  <span
                    className="text-muted-foreground"
                    style={{ fontSize: 'var(--font-size-small)' }}
                  >
                    ｜
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
