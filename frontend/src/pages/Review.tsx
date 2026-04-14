/**
 * 合同/文本审查页面组件 (Review.tsx)
 * 
 * 功能说明：
 * - 提供合同文本的风险审查功能
 * - 识别高、中、低风险条款
 * - 给出专业的修改建议
 * 
 * 主要特性：
 * 1. 合同文本输入 - 支持粘贴合同文本
 * 2. Mock风险识别 - 预置5个示例风险点
 * 3. 风险等级分类 - 高/中/低三档
 * 4. 问题分析和建议 - 针对每个风险条款提供专业建议
 * 5. 风险统计 - 展示高/中/低风险条款数量
 */

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Info, Sparkles, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, Stagger } from '@/components/MotionPrimitives';

/**
 * 风险条款数据结构
 */
interface RiskItem {
  id: string;           // 风险项唯一标识
  clause: string;       // 原条款内容
  level: 'high' | 'medium' | 'low';  // 风险等级
  issue: string;        // 问题分析
  suggestion: string;    // 修改建议
}

/**
 * 示例租房合同文本
 * 用于"加载示例"功能，帮助用户快速了解审查效果
 */
const sampleContract = `甲方（出租方）：张三
乙方（承租方）：李四

一、房屋基本情况
甲方将位于北京市朝阳区某路某号的房屋出租给乙方使用。

二、租赁期限
租赁期限为2年，自2025年1月1日至2026年12月31日。

三、租金及支付方式
月租金为人民币5000元，乙方应于每月1日前支付当月租金。逾期支付的，每日按租金的5%支付违约金。

四、押金
乙方须于签约时支付三个月租金作为押金，合同期满后甲方可视房屋状况决定是否退还。

五、房屋维修
房屋及附属设施的维修均由乙方负责和承担费用。

六、合同解除
甲方有权随时解除合同，乙方需在接到通知后3日内搬离。

七、争议解决
本合同发生争议的，由甲方所在地人民法院管辖。`;

/**
 * Mock 风险识别结果
 * 预置了对示例合同的风险分析
 */
const mockRisks: RiskItem[] = [
  {
    id: '1',
    clause: '逾期支付的，每日按租金的5%支付违约金',
    level: 'high',
    issue: '违约金比例过高，日5%相当于年利率1825%，远超法律保护上限，可能被法院认定为无效。',
    suggestion: '建议将违约金调整为每日万分之五或约定合理的固定金额，参照同类合同的市场标准设定。',
  },
  {
    id: '2',
    clause: '合同期满后甲方可视房屋状况决定是否退还',
    level: 'high',
    issue: '押金退还条件模糊，赋予甲方单方决定权，对乙方极不公平，存在押金被无理扣留的风险。',
    suggestion: '建议明确押金退还的具体条件和时限，如"合同期满且乙方按约返还房屋后7日内，甲方应退还押金，如有扣除应提供明细"。',
  },
  {
    id: '3',
    clause: '房屋及附属设施的维修均由乙方负责和承担费用',
    level: 'medium',
    issue: '将所有维修责任转嫁给承租方不合理。根据法律规定，出租方应承担房屋主体结构和设施的维修义务。',
    suggestion: '建议区分正常使用损耗（甲方负责）和乙方过错造成的损坏（乙方负责），符合《民法典》第七百一十二条规定。',
  },
  {
    id: '4',
    clause: '甲方有权随时解除合同，乙方需在接到通知后3日内搬离',
    level: 'high',
    issue: '甲方单方面享有无条件解除权且搬离期限过短，严重侵害承租方权益，违反合同公平原则。',
    suggestion: '建议约定双方对等的解除条件，并给予合理的搬离期限（如30日），同时约定提前解除的补偿条款。',
  },
  {
    id: '5',
    clause: '由甲方所在地人民法院管辖',
    level: 'low',
    issue: '管辖约定合法但可能对乙方不便。租赁合同纠纷通常可由不动产所在地法院管辖。',
    suggestion: '建议约定为"房屋所在地人民法院管辖"，更符合不动产纠纷的管辖规则。',
  },
];

/**
 * 风险等级配置
 * 定义各等级的颜色、图标和标签
 */
const levelConfig = {
  high: { 
    label: '高风险', 
    icon: AlertTriangle, 
    color: 'var(--destructive)', 
    bg: 'color-mix(in oklch, var(--destructive) 8%, transparent)' 
  },
  medium: { 
    label: '中风险', 
    icon: FileWarning, 
    color: 'var(--warning)', 
    bg: 'color-mix(in oklch, var(--warning) 10%, transparent)' 
  },
  low: { 
    label: '低风险', 
    icon: Info, 
    color: 'var(--info)', 
    bg: 'color-mix(in oklch, var(--info) 10%, transparent)' 
  },
};

/**
 * 合同审查页面主组件
 */
export default function Review() {
  const [text, setText] = useState('');           // 合同文本输入
  const [reviewing, setReviewing] = useState(false); // 审查中状态
  const [risks, setRisks] = useState<RiskItem[] | null>(null); // 审查结果

  /**
   * 执行合同审查
   * 模拟AI审查过程
   */
  const handleReview = () => {
    if (!text.trim()) return;
    setReviewing(true);
    // 模拟2秒审查延迟
    setTimeout(() => {
      setRisks(mockRisks);
      setReviewing(false);
    }, 2000);
  };

  /**
   * 加载示例合同
   * 快速填充示例文本供用户体验
   */
  const handleLoadSample = () => {
    setText(sampleContract);
  };

  // 计算各风险等级的数量
  const highCount = risks?.filter((r) => r.level === 'high').length ?? 0;
  const mediumCount = risks?.filter((r) => r.level === 'medium').length ?? 0;
  const lowCount = risks?.filter((r) => r.level === 'low').length ?? 0;

  return (
    <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', minHeight: 'calc(100vh - 65px)' }}>
      <div className="container max-w-4xl">
        {/* 页面标题 */}
        <FadeIn style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1
            className="font-bold text-foreground"
            style={{
              fontSize: 'var(--font-size-headline)',
              marginBottom: 'var(--spacing-xs)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            合同/文本审查
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
            粘贴或输入合同文本，AI将自动识别风险条款并给出修改建议
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--spacing-lg)' }}>
          {/* 左侧：合同文本输入区域 */}
          <FadeIn>
            <div
              className="rounded-xl border border-border bg-card"
              style={{ padding: 'var(--spacing-lg)', boxShadow: 'var(--ds-shadow-sm)' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                <h2
                  className="font-semibold text-foreground"
                  style={{ fontSize: 'var(--font-size-body)' }}
                >
                  合同文本
                </h2>
                {/* 加载示例按钮 */}
                <button
                  onClick={handleLoadSample}
                  className="text-primary hover:underline cursor-pointer"
                  style={{ fontSize: 'var(--font-size-small)' }}
                >
                  加载示例合同
                </button>
              </div>

              {/* 合同文本输入框 */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="请粘贴或输入需要审查的合同/法律文本..."
                rows={18}
                className="w-full rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-ring"
                style={{
                  padding: 'var(--spacing-md)',
                  fontSize: 'var(--font-size-label)',
                  lineHeight: 1.7,
                  resize: 'vertical',
                  transition: 'var(--duration-fast) var(--ease-default)',
                }}
              />

              {/* 审查按钮 */}
              <div className="flex" style={{ marginTop: 'var(--spacing-md)', gap: 'var(--spacing-sm)' }}>
                <Button
                  onClick={handleReview}
                  disabled={!text.trim() || reviewing}
                  className="flex-1 cursor-pointer"
                  size="lg"
                >
                  {reviewing ? (
                    <>
                      <Sparkles size={18} className="animate-pulse" style={{ marginRight: 'var(--spacing-xs)' }} />
                      AI审查中...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} style={{ marginRight: 'var(--spacing-xs)' }} />
                      开始审查
                    </>
                  )}
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* 右侧：审查报告区域 */}
          <FadeIn delay={0.1}>
            <div
              className="rounded-xl border border-border bg-card"
              style={{ padding: 'var(--spacing-lg)', boxShadow: 'var(--ds-shadow-sm)' }}
            >
              <h2
                className="font-semibold text-foreground"
                style={{
                  fontSize: 'var(--font-size-body)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                审查报告
              </h2>

              {/* 未开始审查时的空状态 */}
              {!risks ? (
                <div className="flex flex-col items-center justify-center text-center" style={{ padding: 'var(--spacing-3xl) 0' }}>
                  <ShieldCheck size={48} className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.3 }} />
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
                    {reviewing ? 'AI正在分析合同条款...' : '输入合同文本后点击"开始审查"'}
                  </p>
                </div>
              ) : (
                <div>
                  {/* 风险统计摘要 */}
                  <div
                    className="grid grid-cols-3 rounded-lg"
                    style={{
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-md)',
                      background: 'var(--secondary)',
                      marginBottom: 'var(--spacing-lg)',
                    }}
                  >
                    {/* 高风险数量 */}
                    <div className="text-center">
                      <div className="font-bold" style={{ color: 'var(--destructive)', fontSize: 'var(--font-size-title)' }}>
                        {highCount}
                      </div>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-small)' }}>高风险</div>
                    </div>
                    {/* 中风险数量 */}
                    <div className="text-center">
                      <div className="font-bold" style={{ color: 'var(--warning)', fontSize: 'var(--font-size-title)' }}>
                        {mediumCount}
                      </div>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-small)' }}>中风险</div>
                    </div>
                    {/* 低风险数量 */}
                    <div className="text-center">
                      <div className="font-bold" style={{ color: 'var(--info)', fontSize: 'var(--font-size-title)' }}>
                        {lowCount}
                      </div>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--font-size-small)' }}>低风险</div>
                    </div>
                  </div>

                  {/* 风险条款列表 */}
                  <Stagger className="flex flex-col" style={{ gap: 'var(--spacing-md)' }}>
                    {risks.map((risk) => {
                      const cfg = levelConfig[risk.level];  // 获取该风险等级的样式配置
                      return (
                        <FadeIn key={risk.id}>
                          <div
                            className="rounded-lg border"
                            style={{
                              borderColor: cfg.color,
                              borderLeftWidth: 3,  // 左侧高亮边框
                              padding: 'var(--spacing-md)',
                            }}
                          >
                            {/* 风险等级标签 */}
                            <div className="flex items-center" style={{ gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                              <cfg.icon size={16} style={{ color: cfg.color }} />
                              <span
                                className="rounded font-medium"
                                style={{
                                  padding: '1px var(--spacing-xs)',
                                  fontSize: 'var(--font-size-small)',
                                  background: cfg.bg,
                                  color: cfg.color,
                                }}
                              >
                                {cfg.label}
                              </span>
                            </div>

                            {/* 原条款内容 */}
                            <div
                              className="rounded"
                              style={{
                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                background: 'var(--secondary)',
                                fontSize: 'var(--font-size-small)',
                                color: 'var(--foreground)',
                                marginBottom: 'var(--spacing-sm)',
                                fontStyle: 'italic',
                              }}
                            >
                              "{risk.clause}"
                            </div>

                            {/* 问题分析 */}
                            <p
                              className="text-foreground"
                              style={{
                                fontSize: 'var(--font-size-label)',
                                lineHeight: 'var(--line-height)',
                                marginBottom: 'var(--spacing-xs)',
                              }}
                            >
                              <strong>问题：</strong>{risk.issue}
                            </p>

                            {/* 修改建议 */}
                            <p
                              style={{
                                fontSize: 'var(--font-size-label)',
                                lineHeight: 'var(--line-height)',
                                color: 'var(--success)',
                              }}
                            >
                              <strong>建议：</strong>{risk.suggestion}
                            </p>
                          </div>
                        </FadeIn>
                      );
                    })}
                  </Stagger>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
