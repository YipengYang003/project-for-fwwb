/**
 * 诉讼费用计算器页面组件 (Calculator.tsx)
 * 
 * 功能说明：
 * - 提供多种法律相关费用的计算功能
 * - 计算结果包含详细的费用明细
 * 
 * 支持的计算类型：
 * 1. 诉讼费计算 - 根据标的金额计算财产案件受理费
 * 2. 劳动补偿计算 - 经济补偿金N或违法解除赔偿金2N
 * 3. 交通赔偿计算 - 交通事故各项赔偿费用
 * 4. 违约金/利息计算 - 按约定或法定利率计算
 */

import { useState } from 'react';
import { Calculator, ChevronDown, AlertCircle } from 'lucide-react';
import { FadeIn } from '@/components/MotionPrimitives';
import { Button } from '@/components/ui/button';

/** 计算器类型枚举 */
type CalcType = 'litigation' | 'labor' | 'traffic' | 'penalty';

/**
 * 诉讼费计算结果数据结构
 */
interface LitigationResult {
  base: number;   // 基础费用
  total: number;  // 总费用
  breakdown: { label: string; amount: number }[]; // 费用明细
}

/**
 * 交通事故赔偿项目数据结构
 */
interface TrafficResult {
  items: { label: string; amount: number }[];
  total: number;
}

/**
 * 诉讼费计算函数
 * 依据《诉讼费用交纳办法》（国务院令第481号）
 * 
 * @param amount - 诉讼标的金额（元）
 * @returns 诉讼费计算结果
 */
function calcLitigationFee(amount: number): LitigationResult {
  let fee = 0;
  const breakdown: { label: string; amount: number }[] = [];

  // 分段计算，不同金额区间适用不同费率
  if (amount <= 10000) {
    // 1万元以下：2.5%，最低50元
    fee = Math.max(50, amount * 0.025);
    breakdown.push({ label: '1万元以下（2.5%，最低50元）', amount: fee });
  } else if (amount <= 100000) {
    // 1万-10万：2.5%扣除已交 + 1%
    const base = 250;
    const extra = (amount - 10000) * 0.01;
    fee = base + extra;
    breakdown.push({ label: '1万元部分（250元）', amount: base });
    breakdown.push({ label: `超出部分 ${((amount - 10000) / 10000).toFixed(2)}万 × 1%`, amount: extra });
  } else if (amount <= 200000) {
    // 10万-20万：1% + 0.7%
    const base = 1150;
    const extra = (amount - 100000) * 0.007;
    fee = base + extra;
    breakdown.push({ label: '10万元部分（1150元）', amount: base });
    breakdown.push({ label: `超出部分 ${((amount - 100000) / 10000).toFixed(2)}万 × 0.7%`, amount: extra });
  } else if (amount <= 500000) {
    // 20万-50万：0.7% + 0.5%
    const base = 1850;
    const extra = (amount - 200000) * 0.005;
    fee = base + extra;
    breakdown.push({ label: '20万元部分（1850元）', amount: base });
    breakdown.push({ label: `超出部分 ${((amount - 200000) / 10000).toFixed(2)}万 × 0.5%`, amount: extra });
  } else if (amount <= 1000000) {
    // 50万-100万：0.5% + 0.4%
    const base = 3350;
    const extra = (amount - 500000) * 0.004;
    fee = base + extra;
    breakdown.push({ label: '50万元部分（3350元）', amount: base });
    breakdown.push({ label: `超出部分 ${((amount - 500000) / 10000).toFixed(2)}万 × 0.4%`, amount: extra });
  } else if (amount <= 2000000) {
    // 100万-200万：0.4% + 0.3%
    const base = 5350;
    const extra = (amount - 1000000) * 0.003;
    fee = base + extra;
    breakdown.push({ label: '100万元部分（5350元）', amount: base });
    breakdown.push({ label: `超出部分 ${((amount - 1000000) / 10000).toFixed(2)}万 × 0.3%`, amount: extra });
  } else {
    // 200万以上：0.3% + 0.2%
    const base = 8350;
    const extra = (amount - 2000000) * 0.002;
    fee = base + extra;
    breakdown.push({ label: '200万元部分（8350元）', amount: base });
    breakdown.push({ label: `超出部分 ${((amount - 2000000) / 10000).toFixed(2)}万 × 0.2%`, amount: extra });
  }

  return { base: fee, total: Math.round(fee * 100) / 100, breakdown };
}

/**
 * 诉讼费用计算器页面主组件
 */
export default function CalcPage() {
  const [calcType, setCalcType] = useState<CalcType>('litigation'); // 当前计算器类型

  // ── 诉讼费计算相关状态 ──────────────────────────
  const [litAmount, setLitAmount] = useState('');           // 标的金额
  const [litResult, setLitResult] = useState<LitigationResult | null>(null); // 计算结果

  // ── 劳动补偿计算相关状态 ──────────────────────────
  const [laborYears, setLaborYears] = useState('');         // 工作年限
  const [laborMonthSalary, setLaborMonthSalary] = useState(''); // 月工资
  const [laborType, setLaborType] = useState<'legal' | 'illegal'>('legal'); // 解除类型
  const [laborResult, setLaborResult] = useState<string | null>(null); // 计算结果

  // ── 交通赔偿计算相关状态 ──────────────────────────
  const [trafficMedical, setTrafficMedical] = useState('');     // 医疗费
  const [trafficLostWork, setTrafficLostWork] = useState('');     // 日均收入
  const [trafficLostDays, setTrafficLostDays] = useState('');     // 误工天数
  const [trafficNurse, setTrafficNurse] = useState('');          // 护理费/天
  const [trafficNurseDays, setTrafficNurseDays] = useState('');  // 护理天数
  const [trafficDisability, setTrafficDisability] = useState('0'); // 伤残等级
  const [trafficResult, setTrafficResult] = useState<TrafficResult | null>(null);

  // ── 违约金计算相关状态 ──────────────────────────
  const [penaltyAmount, setPenaltyAmount] = useState('');   // 本金
  const [penaltyRate, setPenaltyRate] = useState('');       // 年利率(%)
  const [penaltyDays, setPenaltyDays] = useState('');        // 逾期天数
  const [penaltyResult, setPenaltyResult] = useState<string | null>(null);

  /** 伤残等级对应的赔偿比例 */
  const DISABILITY_RATES: Record<string, number> = {
    '0': 0, '10': 0.1, '9': 0.2, '8': 0.3, '7': 0.4, '6': 0.5,
    '5': 0.6, '4': 0.7, '3': 0.8, '2': 0.9, '1': 1.0,
  };

  /**
   * 执行诉讼费计算
   */
  const calcLitigation = () => {
    const amount = parseFloat(litAmount);
    if (isNaN(amount) || amount < 0) return;
    setLitResult(calcLitigationFee(amount));
  };

  /**
   * 执行劳动补偿计算
   * 合法解除：N倍月工资
   * 违法解除：2N倍月工资（赔偿金）
   */
  const calcLabor = () => {
    const years = parseFloat(laborYears);
    const salary = parseFloat(laborMonthSalary);
    if (isNaN(years) || isNaN(salary) || years <= 0 || salary <= 0) return;
    // 计算应支付月数：满6个月按1年，不满6个月按0.5年
    const months = years >= 6 ? Math.ceil(years) : years >= 0.5 ? Math.ceil(years) : 0.5;
    const base = months * salary;
    const result = laborType === 'illegal' ? base * 2 : base;
    const formula = laborType === 'illegal'
      ? `违法解除：赔偿金 = ${months} 月 × ${salary}元 × 2 = ${result.toFixed(2)} 元`
      : `经济补偿金 = ${months} 月 × ${salary} 元 = ${result.toFixed(2)} 元`;
    setLaborResult(formula);
  };

  /**
   * 执行交通事故赔偿计算
   * 包含：医疗费、误工费、护理费、残疾赔偿金
   */
  const calcTraffic = () => {
    const items: { label: string; amount: number }[] = [];
    const medical = parseFloat(trafficMedical) || 0;
    const lostWork = parseFloat(trafficLostWork) || 0;
    const lostDays = parseFloat(trafficLostDays) || 0;
    const nurse = parseFloat(trafficNurse) || 0;
    const nurseDays = parseFloat(trafficNurseDays) || 0;
    const disabilityLevel = parseInt(trafficDisability);

    // 医疗费
    if (medical > 0) items.push({ label: '医疗费', amount: medical });
    // 误工费
    if (lostWork > 0 && lostDays > 0) items.push({ label: `误工费（${lostDays}天 × ${lostWork}元/天）`, amount: lostWork * lostDays });
    // 护理费
    if (nurse > 0 && nurseDays > 0) items.push({ label: `护理费（${nurseDays}天 × ${nurse}元/天）`, amount: nurse * nurseDays });
    // 残疾赔偿金
    if (disabilityLevel > 0 && disabilityLevel <= 10) {
      const rate = DISABILITY_RATES[String(disabilityLevel)] ?? 0;
      const annualIncome = 45000; // 全国居民人均可支配收入参考值
      const disability = annualIncome * 20 * rate;
      items.push({ label: `残疾赔偿金（${disabilityLevel}级，${(rate * 100).toFixed(0)}%）`, amount: disability });
    }

    const total = items.reduce((s, i) => s + i.amount, 0);
    setTrafficResult({ items, total });
  };

  /**
   * 执行违约金/利息计算
   * 公式：本金 × 年利率 ÷ 365 × 逾期天数
   */
  const calcPenalty = () => {
    const amount = parseFloat(penaltyAmount);
    const rate = parseFloat(penaltyRate) / 100;
    const days = parseFloat(penaltyDays);
    if (isNaN(amount) || isNaN(rate) || isNaN(days)) return;
    const interest = amount * rate * days;
    setPenaltyResult(`违约金/利息 = ${amount}元 × ${(rate * 100).toFixed(4)}% × ${days}天 = ${interest.toFixed(2)} 元`);
  };

  /** Tab 选项配置 */
  const tabs: { key: CalcType; label: string; emoji: string }[] = [
    { key: 'litigation', label: '诉讼费', emoji: '⚖️' },
    { key: 'labor', label: '劳动补偿', emoji: '👷' },
    { key: 'traffic', label: '交通赔偿', emoji: '🚗' },
    { key: 'penalty', label: '违约金/利息', emoji: '💰' },
  ];

  /** 格式化数字为千分位显示 */
  const fmt = (n: number) => n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: 'var(--background)' }}>
      {/* 页面头部 */}
      <div style={{ background: 'linear-gradient(135deg, var(--hero) 0%, oklch(0.28 0.08 255) 100%)', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="flex items-center mb-2" style={{ gap: 'var(--spacing-sm)' }}>
              <Calculator size={26} style={{ color: 'var(--theme-gold)' }} />
              <h1 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', color: 'var(--hero-foreground)' }}>
                诉讼费用计算
              </h1>
            </div>
            <p style={{ color: 'oklch(0.80 0.01 250)', fontSize: 'var(--font-size-body)', marginBottom: 4 }}>
              法律相关费用一键核算，精准透明
            </p>
            <p style={{ color: 'oklch(0.60 0.03 250)', fontSize: 'var(--font-size-label)' }}>
              计算结果仅供参考，实际费用以法院核定为准
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container max-w-3xl" style={{ padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
        {/* Tab 切换按钮组 */}
        <FadeIn>
          <div className="flex flex-wrap rounded-xl border border-border bg-card overflow-hidden mb-6" style={{ gap: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCalcType(tab.key)}
                className="flex-1 flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  padding: '10px 8px',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: calcType === tab.key ? 600 : 400,
                  background: calcType === tab.key ? 'var(--primary)' : 'transparent',
                  color: calcType === tab.key ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  minWidth: 80,
                }}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <div className="rounded-2xl border border-border bg-card" style={{ padding: 'var(--spacing-xl)', boxShadow: 'var(--ds-shadow-md)' }}>

            {/* ── 诉讼费计算 ── */}
            {calcType === 'litigation' && (
              <div>
                <h2 className="font-bold text-foreground mb-1" style={{ fontSize: 'var(--font-size-title)' }}>⚖️ 诉讼费计算</h2>
                <p className="text-muted-foreground mb-5" style={{ fontSize: 'var(--font-size-label)' }}>
                  依据《诉讼费用交纳办法》（国务院令第481号）计算财产案件受理费
                </p>
                <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>
                  诉讼标的金额（元）
                </label>
                <input
                  type="number"
                  value={litAmount}
                  onChange={(e) => setLitAmount(e.target.value)}
                  placeholder="请输入诉讼标的金额，如：50000"
                  className="w-full rounded-xl border border-border bg-background text-foreground outline-none"
                  style={{ padding: '10px 14px', fontSize: 'var(--font-size-body)', marginBottom: 16 }}
                />
                <Button onClick={calcLitigation} className="w-full cursor-pointer" style={{ marginBottom: 16 }}>
                  <Calculator size={16} style={{ marginRight: 6 }} />
                  立即计算
                </Button>
                {litResult && (
                  <div className="rounded-xl border" style={{ padding: 'var(--spacing-lg)', background: 'color-mix(in oklch, var(--primary) 5%, transparent)', borderColor: 'var(--primary)' }}>
                    <div className="font-bold text-primary mb-3" style={{ fontSize: 'var(--font-size-title)' }}>
                      应缴诉讼费：¥{fmt(litResult.total)}
                    </div>
                    <div className="flex flex-col" style={{ gap: 6 }}>
                      {litResult.breakdown.map((b, i) => (
                        <div key={i} className="flex justify-between" style={{ fontSize: 'var(--font-size-label)', color: 'var(--muted-foreground)' }}>
                          <span>{b.label}</span>
                          <span className="font-medium text-foreground">¥{fmt(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border text-muted-foreground" style={{ fontSize: 11 }}>
                      注：财产案件受理费由原告预缴；胜诉方由败诉方承担
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 劳动补偿计算 ── */}
            {calcType === 'labor' && (
              <div>
                <h2 className="font-bold text-foreground mb-1" style={{ fontSize: 'var(--font-size-title)' }}>👷 劳动经济补偿金计算</h2>
                <p className="text-muted-foreground mb-5" style={{ fontSize: 'var(--font-size-label)' }}>
                  依据《劳动合同法》第46、47条，计算经济补偿金（N）或违法解除赔偿金（2N）
                </p>

                {/* 解除类型选择 */}
                <div style={{ marginBottom: 16 }}>
                  <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>解除类型</label>
                  <div className="flex rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setLaborType('legal')}
                      className="flex-1 cursor-pointer"
                      style={{ padding: '8px', fontSize: 13, background: laborType === 'legal' ? 'var(--primary)' : 'transparent', color: laborType === 'legal' ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
                    >
                      合法解除（N倍）
                    </button>
                    <button
                      onClick={() => setLaborType('illegal')}
                      className="flex-1 cursor-pointer"
                      style={{ padding: '8px', fontSize: 13, background: laborType === 'illegal' ? 'var(--destructive)' : 'transparent', color: laborType === 'illegal' ? 'white' : 'var(--muted-foreground)' }}
                    >
                      违法解除（2N倍）
                    </button>
                  </div>
                </div>

                {/* 输入字段 */}
                <div className="grid grid-cols-2" style={{ gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>工作年限（年）</label>
                    <input type="number" value={laborYears} onChange={(e) => setLaborYears(e.target.value)} placeholder="如：3.5" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '10px 14px', fontSize: 'var(--font-size-body)' }} />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>月均工资（元）</label>
                    <input type="number" value={laborMonthSalary} onChange={(e) => setLaborMonthSalary(e.target.value)} placeholder="如：8000" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '10px 14px', fontSize: 'var(--font-size-body)' }} />
                  </div>
                </div>

                <Button onClick={calcLabor} className="w-full cursor-pointer mb-4">
                  <Calculator size={16} style={{ marginRight: 6 }} />
                  计算补偿金
                </Button>

                {laborResult && (
                  <div className="rounded-xl border" style={{ padding: 'var(--spacing-lg)', background: laborType === 'illegal' ? 'color-mix(in oklch, var(--destructive) 5%, transparent)' : 'color-mix(in oklch, var(--primary) 5%, transparent)', borderColor: laborType === 'illegal' ? 'var(--destructive)' : 'var(--primary)' }}>
                    <div className="font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>{laborResult}</div>
                    <p className="text-muted-foreground mt-2" style={{ fontSize: 11 }}>注：月工资超过上年度本地社平工资3倍的，补偿月数上限为12个月</p>
                  </div>
                )}
              </div>
            )}

            {/* ── 交通赔偿计算 ── */}
            {calcType === 'traffic' && (
              <div>
                <h2 className="font-bold text-foreground mb-1" style={{ fontSize: 'var(--font-size-title)' }}>🚗 交通事故赔偿计算</h2>
                <p className="text-muted-foreground mb-5" style={{ fontSize: 'var(--font-size-label)' }}>
                  依据《最高人民法院关于审理人身损害赔偿案件适用法律若干问题的解释》
                </p>
                <div className="grid grid-cols-2" style={{ gap: 12, marginBottom: 12 }}>
                  <div>
                    <label className="block text-foreground mb-1" style={{ fontSize: 13, fontWeight: 500 }}>医疗费（元）</label>
                    <input type="number" value={trafficMedical} onChange={(e) => setTrafficMedical(e.target.value)} placeholder="0" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '8px 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1" style={{ fontSize: 13, fontWeight: 500 }}>误工天数（天）</label>
                    <input type="number" value={trafficLostDays} onChange={(e) => setTrafficLostDays(e.target.value)} placeholder="0" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '8px 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1" style={{ fontSize: 13, fontWeight: 500 }}>日均收入（元/天）</label>
                    <input type="number" value={trafficLostWork} onChange={(e) => setTrafficLostWork(e.target.value)} placeholder="0" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '8px 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1" style={{ fontSize: 13, fontWeight: 500 }}>护理天数（天）</label>
                    <input type="number" value={trafficNurseDays} onChange={(e) => setTrafficNurseDays(e.target.value)} placeholder="0" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '8px 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1" style={{ fontSize: 13, fontWeight: 500 }}>护理费（元/天）</label>
                    <input type="number" value={trafficNurse} onChange={(e) => setTrafficNurse(e.target.value)} placeholder="0" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '8px 12px', fontSize: 13 }} />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1" style={{ fontSize: 13, fontWeight: 500 }}>伤残等级</label>
                    <div className="relative">
                      <select value={trafficDisability} onChange={(e) => setTrafficDisability(e.target.value)} className="w-full rounded-xl border border-border bg-background text-foreground outline-none appearance-none cursor-pointer" style={{ padding: '8px 32px 8px 12px', fontSize: 13 }}>
                        <option value="0">无伤残</option>
                        {[10,9,8,7,6,5,4,3,2,1].map(l => <option key={l} value={String(l)}>{l}级伤残</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
                <Button onClick={calcTraffic} className="w-full cursor-pointer mb-4">
                  <Calculator size={16} style={{ marginRight: 6 }} />
                  计算赔偿金额
                </Button>
                {trafficResult && (
                  <div className="rounded-xl border" style={{ padding: 'var(--spacing-lg)', background: 'color-mix(in oklch, var(--primary) 5%, transparent)', borderColor: 'var(--primary)' }}>
                    {trafficResult.items.map((item, i) => (
                      <div key={i} className="flex justify-between mb-2" style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                        <span>{item.label}</span>
                        <span className="font-medium text-foreground">¥{fmt(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-bold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>合计赔偿</span>
                      <span className="font-bold text-primary" style={{ fontSize: 'var(--font-size-title)' }}>¥{fmt(trafficResult.total)}</span>
                    </div>
                    <p className="text-muted-foreground mt-2" style={{ fontSize: 11 }}>残疾赔偿金参照全国居民人均可支配收入45000元/年×20年计算</p>
                  </div>
                )}
              </div>
            )}

            {/* ── 违约金/利息计算 ── */}
            {calcType === 'penalty' && (
              <div>
                <h2 className="font-bold text-foreground mb-1" style={{ fontSize: 'var(--font-size-title)' }}>💰 违约金 / 借款利息计算</h2>
                <p className="text-muted-foreground mb-5" style={{ fontSize: 'var(--font-size-label)' }}>
                  依据合同约定利率或法定LPR利率（民间借贷上限4倍LPR≈14.8%/年）计算
                </p>
                <div className="grid grid-cols-1" style={{ gap: 12, marginBottom: 16 }}>
                  <div>
                    <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>本金/标的金额（元）</label>
                    <input type="number" value={penaltyAmount} onChange={(e) => setPenaltyAmount(e.target.value)} placeholder="如：100000" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '10px 14px', fontSize: 'var(--font-size-body)' }} />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>年利率（%）</label>
                    <input type="number" value={penaltyRate} onChange={(e) => setPenaltyRate(e.target.value)} placeholder="如：6（即6%/年），民间借贷上限约14.8%" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '10px 14px', fontSize: 'var(--font-size-body)' }} />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-2" style={{ fontSize: 'var(--font-size-body)' }}>逾期/拖欠天数（天）</label>
                    <input type="number" value={penaltyDays} onChange={(e) => setPenaltyDays(e.target.value)} placeholder="如：90" className="w-full rounded-xl border border-border bg-background text-foreground outline-none" style={{ padding: '10px 14px', fontSize: 'var(--font-size-body)' }} />
                  </div>
                </div>
                <Button onClick={calcPenalty} className="w-full cursor-pointer mb-4">
                  <Calculator size={16} style={{ marginRight: 6 }} />
                  计算违约金/利息
                </Button>
                {penaltyResult && (
                  <div className="rounded-xl border" style={{ padding: 'var(--spacing-lg)', background: 'color-mix(in oklch, var(--theme-gold) 6%, transparent)', borderColor: 'var(--theme-gold)' }}>
                    <div className="font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>{penaltyResult}</div>
                    <p className="text-muted-foreground mt-2" style={{ fontSize: 11 }}>
                      提示：民间借贷利率超过LPR 4倍（约14.8%/年）的部分不受法律保护；金融机构同期贷款利率另行参照
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </FadeIn>

        {/* 免责声明 */}
        <FadeIn>
          <div
            className="rounded-xl flex items-start mt-4"
            style={{ gap: 10, padding: 'var(--spacing-md)', background: 'color-mix(in oklch, var(--muted) 40%, transparent)', border: '1px solid var(--border)' }}
          >
            <AlertCircle size={15} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-muted-foreground" style={{ fontSize: 12, lineHeight: 1.6 }}>
              本计算工具依据现行法律法规和司法解释设计，计算结果仅供参考估算，不构成法律意见。实际诉讼费由法院核定，实际赔偿金额以法院判决为准。如有重大权益争议，请咨询专业律师。
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
