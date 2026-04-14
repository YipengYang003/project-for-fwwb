/**
 * AI法律问答页面组件 (QA.tsx)
 * 
 * 功能说明：
 * - 提供AI法律智能问答功能
 * - 支持深度思考模式，展示AI推理过程
 * - 根据问题关键词匹配预设的专业回答
 * - 引用相关法律条文
 * 
 * 主要特性：
 * 1. 模拟AI回复 - 根据关键词返回预设的详细法律解答
 * 2. 深度思考模式 - 显示AI分析问题的思考过程
 * 3. 法律条文引用 - 回复中标注相关法条
 * 4. 自动滚动 - 新消息自动滚动到底部
 * 5. 首页跳转 - 支持从首页快捷问题直接跳转
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Scale, User, Sparkles, RotateCcw, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, Stagger } from '@/components/MotionPrimitives';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 消息数据结构
 * 用于存储对话中的用户消息和AI回复
 */
interface Message {
  id: string;              // 消息唯一标识
  role: 'user' | 'assistant'; // 消息角色：用户/AI助手
  content: string;         // 消息内容
  thinking?: string;        // 深度思考内容（AI专有）
  laws?: string[];         // 引用法条列表（AI专有）
  deepThink?: boolean;      // 是否启用深度思考模式
}

/**
 * 快捷问题列表
 * 在未开始对话时显示，帮助用户快速提问
 */
const quickQuestions = [
  '劳动合同到期不续签有什么补偿？',
  '交通事故责任如何认定？',
  '房屋租赁合同纠纷怎么处理？',
  '网购商品质量问题如何维权？',
];

/**
 * Mock 回答数据
 * 根据问题关键词匹配预设的专业法律回答
 * key: 关键词
 * value: 回答内容（包含思考过程、内容、法条）
 */
const mockResponses: Record<string, { content: string; thinking: string; laws: string[] }> = {
  // 默认回答 - 用于未匹配到关键词时
  default: {
    thinking: `分析问题类型：用户提出了一个通用法律问题。

适用法律框架：
1. 首先判断法律关系性质（民事/刑事/行政）
2. 确定适用的基本法律规范
3. 梳理权利义务关系
4. 评估救济途径

推理过程：
- 民事纠纷优先适用《民法典》
- 程序性问题参考《民事诉讼法》
- 建议从证据收集、协商、诉讼三个层次考虑解决路径

结论：给出通用性法律建议，并建议咨询专业律师处理具体事项。`,
    content: '感谢您的提问。根据我对相关法律法规的分析，以下是我的解答：\n\n1. 首先需要确认具体的法律关系和适用的法律条文。\n2. 建议您收集保留相关证据材料，以便后续维权使用。\n3. 如果协商不成，可以通过法律途径解决争议。\n\n建议您根据实际情况咨询专业律师获取更详细的法律建议。',
    laws: ['《中华人民共和国民法典》', '《中华人民共和国民事诉讼法》'],
  },
  // 劳动类问题回答
  劳动: {
    thinking: `问题关键词：劳动合同、到期、不续签、补偿

检索相关法条：
- 《劳动合同法》第44条：劳动合同终止情形
- 《劳动合同法》第46条：需支付经济补偿的情形（第5项：固定期限合同到期终止）
- 《劳动合同法》第47条：经济补偿计算标准

关键分析：
1. 用人单位不续签 → 触发第46条第5项 → 需支付经济补偿N
2. 用人单位维持或提高条件，劳动者不续签 → 无需支付
3. N = 工作年限（每满1年=1个月工资，6个月以上按1年，不足6个月=0.5个月）
4. 月工资上限：本地上年社平工资3倍，最高支付12个月

结论：用人单位不续签应支付经济补偿金N。`,
    content: '关于劳动合同到期不续签的补偿问题：\n\n**一、经济补偿标准（N）**\n用人单位不续签的，应按劳动者在本单位工作年限，每满一年支付一个月工资的标准支付经济补偿。\n\n**二、计算方式**\n- 满6个月不满1年的，按1年计算\n- 不满6个月的，支付半个月工资\n\n**三、特殊情况**\n如果用人单位维持或提高劳动条件续订，而劳动者不同意续签的，则无需支付经济补偿。\n\n**四、月工资上限**\n月工资高于当地上年度职工月平均工资三倍的，按三倍标准支付，最高补偿年限不超过十二年。',
    laws: ['《劳动合同法》第四十四条', '《劳动合同法》第四十六条', '《劳动合同法》第四十七条'],
  },
  // 交通事故问题回答
  交通: {
    thinking: `问题关键词：交通事故、责任认定

法律框架梳理：
- 《道路交通安全法》第73条：事故认定书制度
- 《道路交通事故处理程序规定》：认定标准和程序
- 责任划分原则：行为作用 + 过错程度

责任类型分析：
1. 全部责任：一方完全过错
2. 主要/次要责任：双方过错程度不同
3. 同等责任：双方过错相当
4. 无责任：一方完全无过错

复核机制：收到认定书3日内可申请复核

结论：责任认定以公安机关出具的认定书为准，当事人有异议可申请复核。`,
    content: '关于交通事故责任认定：\n\n**一、责任认定原则**\n公安机关交通管理部门根据当事人的行为对事故发生所起的作用以及过错的严重程度确定责任。\n\n**二、责任划分类型**\n分为全部责任、主要责任、同等责任、次要责任和无责任。\n\n**三、认定书效力**\n交通事故认定书是处理交通事故的证据，应在查明事故原因后十日内制作。\n\n**四、救济途径**\n对事故认定不服的，可在收到之日起**三日内**向上一级公安机关交通管理部门提出书面复核申请。',
    laws: ['《道路交通安全法》第七十三条', '《道路交通事故处理程序规定》第六十条'],
  },
  // 租赁纠纷问题回答
  租赁: {
    thinking: `问题关键词：房屋租赁、合同纠纷

法律适用分析：
- 《民法典》第703-734条：租赁合同专章
- 押金：属于担保性质，无约定时不得随意扣留
- 解决途径优先级：协商 > 调解 > 仲裁/诉讼

管辖权：房屋所在地人民法院（专属管辖问题）

押金退还规则：
- 自然损耗不得扣押金
- 人为损坏可按实际损失扣除
- 无约定扣留理由→全额退还

结论：优先协商，保留证据，必要时诉讼。`,
    content: '关于房屋租赁合同纠纷处理：\n\n**一、协商解决**\n双方应首先尝试友好协商，就争议焦点达成一致。\n\n**二、调解申请**\n可以向人民调解委员会或房屋租赁管理部门申请调解。\n\n**三、仲裁途径**\n合同中约定仲裁条款的，可向约定的仲裁机构申请仲裁。\n\n**四、诉讼途径**\n向**房屋所在地**人民法院提起民事诉讼。\n\n**五、押金问题**\n房东无正当理由扣留押金的，承租人有权要求返还并赔偿损失。自然损耗（如墙面正常老化）不得作为扣押金依据。',
    laws: ['《民法典》第七百零三条至七百三十四条', '《商品房屋租赁管理办法》'],
  },
  // 网购维权问题回答
  网购: {
    thinking: `问题关键词：网购、质量问题、维权

法律依据梳理：
- 《消费者权益保护法》第25条：7天无理由退货
- 《消费者权益保护法》第55条：欺诈行为三倍赔偿
- 《产品质量法》：质量问题举证责任

关键权利：
1. 7天无理由退货（自收货起算，特定商品除外）
2. 质量问题：退货/换货/修理三选一
3. 欺诈行为：退一赔三，最低500元
4. 食品安全：退一赔十

维权渠道优先级：
商家协商 → 平台投诉 → 12315投诉 → 市场监管局 → 法院

结论：保存证据，优先平台投诉，必要时12315介入。`,
    content: '关于网购商品质量问题维权：\n\n**一、七天无理由退货**\n网购商品自签收之日起**七日内**可无理由退货（定制商品、鲜活易腐商品等除外）。\n\n**二、质量问题退换**\n商品存在质量问题的，消费者可要求退货、换货或修理，费用由经营者承担。\n\n**三、维权渠道**\n① 与商家协商 → ② 向平台投诉 → ③ 拨打12315 → ④ 向市场监管局举报 → ⑤ 向法院起诉\n\n**四、惩罚性赔偿**\n- 欺诈行为：退一**赔三**，最低500元\n- 食品安全问题：退一**赔十**，最低1000元',
    laws: ['《消费者权益保护法》第二十五条', '《消费者权益保护法》第五十五条', '《网络购买商品七日无理由退货暂行办法》'],
  },
  // 试用期辞退问题回答
  辞退: {
    thinking: `问题关键词：试用期、辞退、赔偿

法律分析：
- 《劳动合同法》第39条：试用期可合法解除的情形（不符合录用条件、严重违纪等）
- 《劳动合同法》第21条：试用期解除限制

违法解除认定：
- 用人单位未能证明"不符合录用条件"→ 违法解除
- 违法解除赔偿金 = 经济补偿金 × 2（即2N）

试用期工资保护：
- 不得低于转正工资80%
- 不得低于当地最低工资标准

证据收集重点：录用条件书面告知记录、考核结果通知

结论：试用期被辞退，用人单位须证明"不符合录用条件"，否则构成违法解除，应支付2N赔偿金。`,
    content: '关于试用期被辞退的赔偿问题：\n\n**一、合法辞退的条件（用人单位须证明）**\n试用期内，用人单位只有在劳动者"不符合录用条件"时才可合法解除合同。\n\n**二、违法辞退的后果**\n如果用人单位无法证明不符合录用条件，属于**违法解除**，需支付：\n- 赔偿金 = 经济补偿金 × **2倍**（即2N）\n- 每工作满1年 = 1个月工资\n\n**三、维权步骤**\n① 收集证据（劳动合同、工资条、辞退通知）→ ② 申请劳动仲裁（免费，1年时效）→ ③ 对结果不服再起诉\n\n**四、重要提示**\n试用期工资不得低于转正工资的80%，也不得低于当地最低工资标准。',
    laws: ['《劳动合同法》第二十一条', '《劳动合同法》第三十九条', '《劳动合同法》第四十七条', '《劳动合同法》第八十七条'],
  },
  // 借条/借款问题回答
  借条: {
    thinking: `问题关键词：借钱、不还、没有借条

法律分析：
- 没有借条不等于没有债权，关键在于其他证据
- 可替代证据：银行转账记录、微信/支付宝转账截图、聊天记录（含还款承诺）、证人证词

举证策略：
- 转账记录可证明"给付事实"
- 聊天记录可证明"借款合意"
- 对方需举证证明为赠与而非借款

诉讼时效：3年（从知道权利被侵害起算）
管辖：被告住所地或合同履行地法院

建议：先催款（中断时效），再考虑申请支付令或诉讼。`,
    content: '关于没有借条的借款追讨：\n\n**一、没有借条也可以维权**\n只要有其他证据证明借贷关系存在，法院同样支持诉求。\n\n**二、可用的替代证据**\n- 银行转账记录、微信/支付宝转账截图\n- 聊天记录中对方承认借款或承诺还款\n- 证人证词\n- 录音录像（合法取得）\n\n**三、举证要点**\n原告需证明"给付事实"（有转账），对方若称是赠与，由**对方举证**。\n\n**四、维权步骤**\n① 书面催款（保存记录，防止时效届满）→ ② 向法院申请支付令（简便快捷）→ ③ 提起民事诉讼',
    laws: ['《民法典》第六百六十七条', '《民法典》第六百七十五条', '《最高人民法院关于审理民间借贷案件适用法律若干问题的规定》'],
  },
  // 工伤认定问题回答
  工伤: {
    thinking: `问题关键词：上下班途中、车祸、工伤

法律依据：
- 《工伤保险条例》第14条第6项：上下班途中受到非本人主要责任的交通事故伤害，应认定工伤

关键要件分析：
1. "上下班途中"：合理时间、合理路线（不要求唯一路线）
2. "交通事故"：机动车/非机动车均可
3. "非本人主要责任"：本人全责或主要责任则不认定
4. 需有交警出具的事故认定书

申请流程：
事故发生 → 交警认定责任 → 单位30天内申报（或个人1年内申报）→ 劳动能力鉴定 → 享受工伤待遇

注意：可同时获得工伤赔偿和交通事故赔偿，但不得双重获得医疗费等项目。`,
    content: '关于上下班途中发生交通事故是否算工伤：\n\n**一、基本结论**\n**可以认定为工伤**，但需满足以下条件：\n\n**二、认定条件（缺一不可）**\n① 在**合理时间**内（上下班前后的合理时段）\n② 走**合理路线**（不要求必须最短路线）\n③ 受到**交通事故**伤害\n④ 本人承担**非主要责任**（全责或主要责任不予认定）\n\n**三、申请流程**\n交警出具责任认定书 → 用人单位30天内申报工伤（或本人1年内申报）→ 劳动能力鉴定 → 享受工伤待遇\n\n**四、重要提示**\n工伤赔偿与交通事故赔偿可以叠加主张，但医疗费等不得重复获得。',
    laws: ['《工伤保险条例》第十四条第六项', '《最高人民法院关于审理工伤保险行政案件若干问题的规定》第六条'],
  },
};

/**
 * 根据问题关键词匹配对应的Mock回答
 * @param question - 用户输入的问题
 * @returns 匹配的Mock回答数据
 */
function getResponse(question: string) {
  // 关键词列表，按优先级排序
  const keys = ['劳动', '交通', '租赁', '网购', '辞退', '借条', '工伤'];
  for (const key of keys) {
    if (question.includes(key)) {
      return mockResponses[key];
    }
  }
  // 未匹配到关键词时返回默认回答
  return mockResponses.default;
}

/**
 * AI法律问答页面主组件
 */
export default function QA() {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);      // 对话消息列表
  const [input, setInput] = useState('');                       // 输入框内容
  const [isTyping, setIsTyping] = useState(false);              // 是否正在等待AI回复
  const [deepThink, setDeepThink] = useState(false);            // 深度思考模式开关
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set()); // 展开的思考内容ID集合
  const scrollRef = useRef<HTMLDivElement>(null);               // 滚动容器引用
  const hasSentInitial = useRef(false);                         // 防止重复发送首页传入的问题

  /**
   * 监听消息列表变化，自动滚动到底部
   */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  /**
   * 监听URL参数，自动发送从首页传入的问题
   * 支持从首页快捷问题或搜索跳转
   */
  useEffect(() => {
    const q = searchParams.get('q');      // 获取问题参数
    const deep = searchParams.get('deep') === '1'; // 获取深度思考参数
    if (deep) setDeepThink(true);         // 同步深度思考模式
    if (q && !hasSentInitial.current) {
      hasSentInitial.current = true;
      // 延迟50ms确保状态更新完成后再发送
      setTimeout(() => handleSend(q.trim(), deep), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 切换思考内容的展开/收起状态
   * @param id - 消息ID
   */
  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  /**
   * 发送消息处理函数
   * @param text - 问题文本（可选，用于自动发送）
   * @param forceDeep - 强制深度思考模式
   */
  const handleSend = async (text?: string, forceDeep?: boolean) => {
    const question = text !== undefined ? text : input.trim();  // 获取问题文本
    const useDeep = forceDeep !== undefined ? forceDeep : deepThink; // 确定是否深度思考
    if (!question || isTyping) return;                          // 空问题或正在等待时不处理

    // 添加用户消息
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');                  // 清空输入框
    setIsTyping(true);             // 显示加载状态

    // 模拟AI回复延迟（深度思考模式延迟更长）
    const delay = useDeep ? 2200 : 1200;

    setTimeout(() => {
      const resp = getResponse(question);  // 获取匹配的回答
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resp.content,
        thinking: useDeep ? resp.thinking : undefined,  // 仅深度思考模式显示思考过程
        laws: resp.laws,
        deepThink: useDeep,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);         // 隐藏加载状态
    }, delay);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
      {/* 页面头部 - 标题和深度思考开关 */}
      <div
        className="border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between"
        style={{ padding: '8px var(--spacing-lg)' }}
      >
        <div className="container max-w-3xl flex items-center justify-between w-full">
          <div className="flex items-center" style={{ gap: 8 }}>
            <Scale size={18} className="text-primary" />
            <span className="font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
              智能法律咨询
            </span>
            {/* 免责声明标签 */}
            <span
              className="rounded-md text-muted-foreground"
              style={{ fontSize: 11, padding: '2px 6px', background: 'var(--secondary)' }}
            >
              本平台为智能辅助工具，重大权益请咨询专业律师
            </span>
          </div>

          {/* 深度思考模式开关 */}
          <button
            onClick={() => setDeepThink(!deepThink)}
            className="flex items-center rounded-xl cursor-pointer transition-all"
            style={{
              gap: 6,
              padding: '5px 12px',
              background: deepThink
                ? 'color-mix(in oklch, var(--theme-gold) 15%, transparent)'
                : 'var(--secondary)',
              border: deepThink
                ? '1px solid color-mix(in oklch, var(--theme-gold) 40%, transparent)'
                : '1px solid var(--border)',
              color: deepThink ? 'var(--theme-gold)' : 'var(--muted-foreground)',
              fontSize: 13,
              fontWeight: deepThink ? 600 : 400,
            }}
          >
            <Brain size={14} />
            深度思考
            {/* 自定义开关 */}
            <div
              className="rounded-full transition-all"
              style={{
                width: 28,
                height: 16,
                background: deepThink ? 'var(--theme-gold)' : 'var(--border)',
                position: 'relative',
              }}
            >
              <div
                className="rounded-full bg-white absolute top-0.5 transition-all"
                style={{
                  width: 12,
                  height: 12,
                  left: deepThink ? 14 : 2,
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ padding: 'var(--spacing-lg)' }}>
        <div className="container max-w-3xl">
          {/* 未开始对话时显示初始界面 */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ paddingTop: 'var(--spacing-3xl)' }}>
              <FadeIn>
                {/* AI头像 */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'color-mix(in oklch, var(--primary) 10%, transparent)',
                    marginBottom: 'var(--spacing-lg)',
                  }}
                >
                  <Scale size={36} className="text-primary" />
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h2
                  className="font-bold text-foreground text-center"
                  style={{ fontSize: 'var(--font-size-headline)', marginBottom: 'var(--spacing-sm)' }}
                >
                  AI法律问答
                </h2>
              </FadeIn>
              <FadeIn delay={0.15}>
                <p
                  className="text-muted-foreground text-center"
                  style={{ fontSize: 'var(--font-size-body)', marginBottom: 'var(--spacing-xl)', maxWidth: 400 }}
                >
                  输入您的法律问题，AI将为您提供专业解答和相关法条引用
                </p>
              </FadeIn>
              {/* 快捷问题按钮 */}
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 w-full" style={{ gap: 'var(--spacing-sm)' }}>
                {quickQuestions.map((q) => (
                  <FadeIn key={q}>
                    <button
                      onClick={() => handleSend(q)}
                      className="w-full text-left rounded-lg border border-border bg-card hover:bg-secondary cursor-pointer"
                      style={{
                        padding: 'var(--spacing-md)',
                        fontSize: 'var(--font-size-label)',
                        color: 'var(--foreground)',
                        transition: 'var(--duration-fast) var(--ease-default)',
                      }}
                    >
                      {q}
                    </button>
                  </FadeIn>
                ))}
              </Stagger>
            </div>
          ) : (
            /* 对话消息列表 */
            <div className="flex flex-col" style={{ gap: 'var(--spacing-lg)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex max-w-[88%]" style={{ gap: 'var(--spacing-sm)' }}>
                    {/* AI头像（仅AI消息显示） */}
                    {msg.role === 'assistant' && (
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full"
                        style={{ width: 36, height: 36, background: 'var(--primary)', marginTop: 2 }}
                      >
                        <Scale size={18} className="text-primary-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      {/* 深度思考内容区块 */}
                      {msg.thinking && (
                        <div
                          className="rounded-xl mb-2 overflow-hidden"
                          style={{
                            border: '1px solid color-mix(in oklch, var(--theme-gold) 30%, transparent)',
                            background: 'color-mix(in oklch, var(--theme-gold) 5%, transparent)',
                          }}
                        >
                          <button
                            onClick={() => toggleThinking(msg.id)}
                            className="w-full flex items-center justify-between cursor-pointer"
                            style={{ padding: '8px 12px', gap: 6 }}
                          >
                            <div className="flex items-center" style={{ gap: 6 }}>
                              <Brain size={13} style={{ color: 'var(--theme-gold)' }} />
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: 'var(--theme-gold)',
                                }}
                              >
                                深度思考过程
                              </span>
                            </div>
                            {/* 展开/收起图标 */}
                            {expandedThinking.has(msg.id)
                              ? <ChevronUp size={13} style={{ color: 'var(--theme-gold)' }} />
                              : <ChevronDown size={13} style={{ color: 'var(--theme-gold)' }} />
                            }
                          </button>
                          {/* 思考内容动画展开 */}
                          <AnimatePresence>
                            {expandedThinking.has(msg.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div
                                  style={{
                                    padding: '0 12px 10px',
                                    fontSize: 12,
                                    lineHeight: 1.8,
                                    color: 'var(--muted-foreground)',
                                    whiteSpace: 'pre-wrap',
                                    borderTop: '1px solid color-mix(in oklch, var(--theme-gold) 20%, transparent)',
                                    paddingTop: 8,
                                  }}
                                >
                                  {msg.thinking}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 消息主体内容 */}
                      <div
                        className={`rounded-xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
                        style={{
                          padding: 'var(--spacing-md)',
                          fontSize: 'var(--font-size-body)',
                          lineHeight: 1.75,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.content}
                      </div>

                      {/* 法律条文标签 */}
                      {msg.laws && msg.laws.length > 0 && (
                        <div className="flex flex-wrap" style={{ gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-xs)' }}>
                          {msg.laws.map((law) => (
                            <span
                              key={law}
                              className="rounded-md"
                              style={{
                                padding: '2px var(--spacing-xs)',
                                fontSize: 'var(--font-size-small)',
                                background: 'color-mix(in oklch, var(--theme-blue) 10%, transparent)',
                                color: 'var(--theme-blue)',
                              }}
                            >
                              {law}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 用户头像（仅用户消息显示） */}
                    {msg.role === 'user' && (
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full bg-secondary"
                        style={{ width: 36, height: 36, marginTop: 2 }}
                      >
                        <User size={18} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* AI正在输入指示器 */}
              {isTyping && (
                <div className="flex" style={{ gap: 'var(--spacing-sm)' }}>
                  <div
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 36, height: 36, background: 'var(--primary)' }}
                  >
                    <Scale size={18} className="text-primary-foreground" />
                  </div>
                  <div
                    className="rounded-xl bg-card border border-border flex items-center"
                    style={{ padding: 'var(--spacing-md)', gap: 'var(--spacing-xs)' }}
                  >
                    {deepThink
                      ? <Brain size={16} style={{ color: 'var(--theme-gold)' }} className="animate-pulse" />
                      : <Sparkles size={16} className="text-primary animate-pulse" />
                    }
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--font-size-label)' }}>
                      {deepThink ? 'AI深度思考中...' : 'AI正在分析中...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-border bg-card" style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
        <div className="container max-w-3xl">
          <div className="flex items-center" style={{ gap: 'var(--spacing-sm)' }}>
            {/* 新对话按钮（仅在有消息时显示） */}
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 cursor-pointer"
                onClick={() => { setMessages([]); hasSentInitial.current = false; }}
                title="新对话"
              >
                <RotateCcw size={16} />
              </Button>
            )}
            {/* 输入框容器 */}
            <div
              className="flex-1 flex items-center rounded-xl border border-border bg-background"
              style={{ padding: '0 var(--spacing-sm)' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="输入您的法律问题..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                style={{ padding: 'var(--spacing-sm) var(--spacing-xs)', fontSize: 'var(--font-size-body)' }}
              />
              {/* 发送按钮 */}
              <Button
                size="icon"
                className="shrink-0 cursor-pointer"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
