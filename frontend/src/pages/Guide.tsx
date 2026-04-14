/**
 * 维权指引页面组件 (Guide.tsx)
 * 
 * 功能说明：
 * - 提供常见维权场景的详细步骤指引
 * - 包含时效提醒和维权热线信息
 * - 可展开的步骤详情和重要提示
 * 
 * 覆盖的维权场景：
 * 1. 劳动纠纷 - 试用期辞退/拖欠工资/违法解除
 * 2. 租房纠纷 - 押金退还/强制驱逐/房屋质量
 * 3. 消费维权 - 网购退换货/虚假宣传/食品安全
 * 4. 交通事故 - 赔偿/保险理赔/肇事逃逸
 * 5. 工伤维权 - 工作中受伤/职业病/上下班途中
 * 6. 债务纠纷 - 借钱不还/催款/申请支付令
 */

import { useState } from 'react';
import { Navigation, ChevronRight, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock, Phone, Scale } from 'lucide-react';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 维权步骤数据结构
 */
interface Step {
  step: number;      // 步骤序号
  title: string;      // 步骤标题
  desc: string;        // 步骤描述
  tip?: string;        // 可选的温馨提示
}

/**
 * 维权指引配置数据结构
 */
interface Guide {
  id: string;           // 指引唯一标识
  category: string;      // 所属分类
  icon: string;          // Emoji图标
  color: string;         // 主题色（CSS变量值）
  title: string;         // 指引标题
  subtitle: string;     // 副标题/适用场景
  timeLimit?: string;   // 时效限制说明
  steps: Step[];        // 维权步骤列表
  hotline?: string;     // 维权热线电话
  notes: string[];     // 重要提示列表
}

/**
 * 维权指引数据
 * 包含6大常见维权场景的详细步骤和提示
 */
const GUIDES: Guide[] = [
  {
    id: 'labor',
    category: '劳动权益',
    icon: '👷',
    color: 'oklch(0.55 0.18 250)',
    title: '劳动纠纷维权指引',
    subtitle: '试用期辞退 / 拖欠工资 / 违法解除劳动合同',
    timeLimit: '申请劳动仲裁：劳动争议发生之日起 1 年内',
    hotline: '12333（人社部劳动监察热线）',
    steps: [
      { step: 1, title: '收集证据', desc: '保存劳动合同、工资条、打卡记录、工作邮件、社保缴纳记录等证据材料，微信聊天记录注意截图留存。', tip: '证据越全越有利，建议在离职前提前整理备份' },
      { step: 2, title: '协商解决', desc: '优先与用人单位HR或管理层协商，书面提出诉求，保留沟通记录。协商成功可签订书面和解协议。', tip: '协商时全程录音录像，注意保留书面凭证' },
      { step: 3, title: '投诉举报', desc: '协商不成，向当地劳动监察大队投诉。可通过12333热线、政务APP或现场投诉，要求恢复劳动关系或支付赔偿。' },
      { step: 4, title: '申请仲裁', desc: '向劳动合同履行地或用人单位所在地的劳动人事争议仲裁委员会申请仲裁，填写仲裁申请书并提交证据材料。', tip: '仲裁免费，一般45天内结案，是诉讼的前置程序' },
      { step: 5, title: '提起诉讼', desc: '对仲裁结果不服，在收到仲裁裁决书15日内向人民法院提起诉讼。一裁终局情形（11类）除外。' },
    ],
    notes: [
      '违法解除劳动合同：赔偿金 = 经济补偿金 × 2（N×2）',
      '工作每满1年支付1个月工资作为经济补偿（N）',
      '拖欠工资：除补发外还应支付25%的经济补偿金',
      '试用期最长不超过6个月，同一单位只能约定一次',
    ],
  },
  {
    id: 'rental',
    category: '租房纠纷',
    icon: '🏠',
    color: 'oklch(0.55 0.15 145)',
    title: '租房押金退还维权指引',
    subtitle: '押金不退 / 强制驱逐 / 房屋质量问题',
    timeLimit: '民事诉讼时效：3年',
    hotline: '12345（政务服务热线）',
    steps: [
      { step: 1, title: '查阅合同', desc: '仔细阅读租赁合同中关于押金退还条款、违约责任、房屋验收标准等内容，明确双方权利义务。' },
      { step: 2, title: '房屋验收', desc: '退租时与房东共同验收房屋，拍照/录像记录房屋现状，签署验收交接单，对争议项目书面注明。', tip: '自然损耗由房东承担，人为损坏才可扣押金' },
      { step: 3, title: '书面催告', desc: '发送书面催告函（微信、短信、邮件均可），明确要求房东在X日内退还押金，保存发送记录。' },
      { step: 4, title: '投诉调解', desc: '向街道办事处、住房管理局或消费者协会投诉，请求调解。房屋违规出租可向住建局举报。' },
      { step: 5, title: '法律诉讼', desc: '申请支付令（简单案件）或直接向基层人民法院提起民事诉讼，标的额1万元以下走小额诉讼程序。', tip: '1万元以下押金纠纷可申请简易程序，法院一般30天内判决' },
    ],
    notes: [
      '正常使用造成的损耗（如墙面褪色）由房东承担，不得扣押金',
      '房东无故拒退押金，可主张利息及违约金',
      '未登记备案的租赁合同也具有法律效力',
      '签合同前拍照记录房屋原始状态非常重要',
    ],
  },
  {
    id: 'consumer',
    category: '消费维权',
    icon: '🛒',
    color: 'oklch(0.55 0.18 35)',
    title: '消费维权指引',
    subtitle: '网购退换货 / 虚假宣传 / 食品安全',
    timeLimit: '网购7天无理由退货自收货之日起计算',
    hotline: '12315（全国消费者投诉热线）',
    steps: [
      { step: 1, title: '保留凭证', desc: '保存购物小票、发票、快递单、商品照片、聊天记录、商品页面截图（含价格、规格、宣传内容）。', tip: '及时截图，卖家可能删除商品信息' },
      { step: 2, title: '联系商家', desc: '在平台上联系商家客服，说明问题并提出退款/换货/赔偿诉求，保存全程聊天记录。' },
      { step: 3, title: '平台投诉', desc: '商家不处理，向电商平台（淘宝/京东/拼多多等）发起售后投诉，平台一般5-7个工作日处理。', tip: '平台介入后商家违规可能被处罚，平台通常偏向消费者' },
      { step: 4, title: '向12315投诉', desc: '登录12315.gov.cn或拨打12315热线，填写投诉信息。监管部门会联系商家调解，并有行政处罚权。' },
      { step: 5, title: '申请仲裁/诉讼', desc: '通过电商平台仲裁或向法院提起诉讼。食品安全问题可要求10倍赔偿，虚假宣传可要求3倍赔偿。', tip: '欺诈行为可要求"退一赔三"，食品安全问题"退一赔十"' },
    ],
    notes: [
      '食品安全问题：可要求支付价款10倍或损失3倍的赔偿',
      '欺诈行为：可要求增加赔偿购买价款的3倍，最低500元',
      '7天无理由退货：快递费一般由消费者承担',
      '拒绝退货但商品有质量问题：可要求修理、更换或退货',
    ],
  },
  {
    id: 'traffic',
    category: '交通事故',
    icon: '🚗',
    color: 'oklch(0.55 0.18 15)',
    title: '交通事故维权指引',
    subtitle: '交通事故赔偿 / 保险理赔 / 肇事逃逸',
    timeLimit: '人身损害赔偿诉讼时效：3年（从知道或应当知道之日起）',
    hotline: '122（交通事故报警）/ 12395（保险投诉）',
    steps: [
      { step: 1, title: '现场处置', desc: '立即拨打122报警和120急救，开启双闪、设置警示标志。对现场拍照取证（车辆位置、碰撞痕迹、道路状况）。', tip: '轻微事故可协商解决，但建议仍报警留档' },
      { step: 2, title: '获取认定书', desc: '配合交警勘查现场，获取《交通事故认定书》，这是责任划分和保险理赔的关键依据。', tip: '对认定结果有异议，可在3日内提出申请复核' },
      { step: 3, title: '就医治疗', desc: '伤者及时就医，保存所有医疗票据（挂号费、住院费、药费、检查费），记录误工损失。' },
      { step: 4, title: '保险理赔', desc: '向对方保险公司报案，提交事故认定书、医疗单据、修车费用等材料，申请交强险和商业险赔偿。', tip: '强制保险优先赔付，不足部分由商业险或对方负责' },
      { step: 5, title: '法律诉讼', desc: '保险赔偿不足或对方拒赔，向事故发生地法院提起民事诉讼，要求赔偿医疗费、误工费、残疾赔偿金等。' },
    ],
    notes: [
      '交强险死亡伤残赔偿限额：18万元；医疗费用：1.8万元',
      '上下班途中发生的交通事故，同时满足工伤认定条件的可申请工伤',
      '肇事逃逸：对方全责，可向道路交通事故社会救助基金申请垫付',
      '醉驾造成交通事故：保险公司赔偿后有权向醉驾者追偿',
    ],
  },
  {
    id: 'injury',
    category: '工伤维权',
    icon: '⚕️',
    color: 'oklch(0.50 0.15 300)',
    title: '工伤认定维权指引',
    subtitle: '工作中受伤 / 职业病 / 上下班途中受伤',
    timeLimit: '工伤认定申请：事故发生之日起1年内',
    hotline: '12333（工伤保险热线）',
    steps: [
      { step: 1, title: '及时救治', desc: '先救治伤者，保留所有医疗记录。工伤医疗费用由工伤保险基金或用人单位先行支付。' },
      { step: 2, title: '申请工伤认定', desc: '用人单位应在30天内申报工伤；单位不申报，劳动者可在1年内自行向社保行政部门申请工伤认定。', tip: '保存工作证、考勤记录、事故当天照片等证据' },
      { step: 3, title: '劳动能力鉴定', desc: '伤情稳定后，申请劳动能力鉴定委员会评定伤残等级（1-10级），鉴定结果决定赔偿标准。' },
      { step: 4, title: '享受工伤待遇', desc: '根据鉴定结果领取一次性伤残补助金、伤残津贴、医疗补助金等，具体金额按本人工资和伤残等级计算。' },
      { step: 5, title: '争议处理', desc: '对工伤认定或伤残鉴定有异议，可申请行政复议或行政诉讼；待遇纠纷通过劳动仲裁解决。' },
    ],
    notes: [
      '工伤认定范围：工作时间工作场所因工作受伤；上下班途中非本人主要责任的交通事故',
      '10级伤残一次性伤残补助金：7个月本人工资',
      '用人单位未参加工伤保险：全部工伤待遇由用人单位承担',
      '职业病认定需先做职业病诊断，再申请工伤认定',
    ],
  },
  {
    id: 'debt',
    category: '债务纠纷',
    icon: '💰',
    color: 'oklch(0.55 0.15 75)',
    title: '民间借贷维权指引',
    subtitle: '借钱不还 / 催款 / 申请支付令',
    timeLimit: '民事诉讼时效：3年（从知道或应当知道之日起）',
    steps: [
      { step: 1, title: '整理债权凭证', desc: '收集借条、转账记录（银行流水/微信支付宝截图）、还款承诺、聊天记录等，确认借款金额和到期日期。' },
      { step: 2, title: '发送催款函', desc: '通过书面（挂号信）或微信发送催款通知，明确还款金额和最后期限，保存催款记录可防止时效抗辩。', tip: '催款可中断诉讼时效，每隔一段时间催一次' },
      { step: 3, title: '申请支付令', desc: '债权关系明确、债务人无异议可能的，向法院申请支付令，费用低廉，通常15天内发出。', tip: '支付令适合有明确证据、对方可能会还钱的情形' },
      { step: 4, title: '提起诉讼', desc: '向被告住所地或合同履行地法院提起民事诉讼，同时可申请财产保全冻结对方账户或房产。', tip: '诉讼前申请保全非常重要，防止对方转移财产' },
      { step: 5, title: '申请执行', desc: '胜诉判决生效后申请强制执行，法院可冻结、划拨银行存款，查封、拍卖房产车辆。' },
    ],
    notes: [
      '无借条但有转账记录：可作为债权凭证，但需证明为借款而非赠与',
      '民间借贷利率上限：LPR的4倍（目前约14.8%），超出部分不受保护',
      '借款人下落不明：可申请公告送达，通过缺席判决追债',
      '申请财产保全需提供担保，金额一般为债权金额的20-30%',
    ],
  },
];

/**
 * 分类选项列表
 */
const CATEGORIES = ['全部', '劳动权益', '租房纠纷', '消费维权', '交通事故', '工伤维权', '债务纠纷'];

/**
 * 维权指引页面主组件
 */
export default function Guide() {
  const [activeCategory, setActiveCategory] = useState('全部'); // 当前选中的分类
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null); // 当前选中的指引
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set()); // 展开的步骤序号集合

  /**
   * 根据分类筛选指引
   */
  const filtered = GUIDES.filter(
    (g) => activeCategory === '全部' || g.category === activeCategory
  );

  /**
   * 切换步骤的展开/收起状态
   */
  const toggleStep = (step: number) => {
    setExpandedSteps((prev) => {
      const s = new Set(prev);
      s.has(step) ? s.delete(step) : s.add(step);
      return s;
    });
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: 'var(--background)' }}>
      {/* 页面头部 */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--hero) 0%, oklch(0.28 0.08 255) 100%)',
          padding: 'var(--spacing-2xl) var(--spacing-lg)',
        }}
      >
        <div className="container max-w-4xl">
          <FadeIn>
            <div className="flex items-center" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
              <Navigation size={26} style={{ color: 'var(--theme-gold)' }} />
              <h1 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', color: 'var(--hero-foreground)' }}>
                维权指引
              </h1>
            </div>
            <p style={{ color: 'oklch(0.80 0.01 250)', fontSize: 'var(--font-size-body)', marginBottom: 4 }}>
              全场景维权步骤，清晰易懂可操作
            </p>
            <p style={{ color: 'oklch(0.60 0.03 250)', fontSize: 'var(--font-size-label)' }}>
              本平台为智能辅助工具，重大权益请咨询专业律师
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="container max-w-4xl" style={{ padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
        {/* 分类筛选按钮组 */}
        <FadeIn style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="flex flex-wrap" style={{ gap: 'var(--spacing-xs)' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setActiveCategory(c); setSelectedGuide(null); }}
                className="rounded-lg cursor-pointer"
                style={{
                  padding: '6px var(--spacing-md)',
                  fontSize: 'var(--font-size-label)',
                  fontWeight: activeCategory === c ? 600 : 400,
                  background: activeCategory === c ? 'var(--primary)' : 'var(--secondary)',
                  color: activeCategory === c ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  transition: 'all 0.15s',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* 指引卡片列表视图 */}
        {!selectedGuide ? (
          <Stagger className="grid gap-4 md:grid-cols-2">
            {filtered.map((guide) => (
              <HoverLift key={guide.id} lift={-3}>
                <div
                  onClick={() => { setSelectedGuide(guide); setExpandedSteps(new Set()); }}
                  className="rounded-xl border border-border bg-card cursor-pointer group"
                  style={{ padding: 'var(--spacing-lg)', boxShadow: 'var(--ds-shadow-sm)' }}
                >
                  <div className="flex items-start" style={{ gap: 'var(--spacing-md)' }}>
                    {/* 图标 */}
                    <div
                      className="rounded-xl flex items-center justify-center shrink-0"
                      style={{ width: 52, height: 52, background: `color-mix(in oklch, ${guide.color} 12%, transparent)`, fontSize: 24 }}
                    >
                      {guide.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        {/* 分类标签 */}
                        <span
                          className="rounded-md font-medium"
                          style={{
                            padding: '2px 8px',
                            fontSize: 11,
                            background: `color-mix(in oklch, ${guide.color} 12%, transparent)`,
                            color: guide.color,
                            marginBottom: 4,
                            display: 'inline-block',
                          }}
                        >
                          {guide.category}
                        </span>
                        <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary" style={{ transition: 'color 0.15s' }} />
                      </div>
                      <h3 className="font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)', marginBottom: 4 }}>
                        {guide.title}
                      </h3>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-label)' }}>
                        {guide.subtitle}
                      </p>
                      {/* 时效限制 */}
                      {guide.timeLimit && (
                        <div className="flex items-center mt-2" style={{ gap: 4, color: 'var(--muted-foreground)', fontSize: 11 }}>
                          <Clock size={11} />
                          {guide.timeLimit}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </HoverLift>
            ))}
          </Stagger>
        ) : (
          /**
           * 指引详情视图
           */
          <FadeIn>
            {/* 返回按钮 */}
            <button
              onClick={() => setSelectedGuide(null)}
              className="flex items-center text-muted-foreground hover:text-foreground cursor-pointer mb-4"
              style={{ gap: 4, fontSize: 'var(--font-size-label)' }}
            >
              ← 返回列表
            </button>

            {/* 指引详情卡片 */}
            <div className="rounded-xl border border-border bg-card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', boxShadow: 'var(--ds-shadow-sm)' }}>
              {/* 指引头部信息 */}
              <div className="flex items-start" style={{ gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div
                  className="rounded-xl flex items-center justify-center shrink-0"
                  style={{ width: 60, height: 60, background: `color-mix(in oklch, ${selectedGuide.color} 12%, transparent)`, fontSize: 28 }}
                >
                  {selectedGuide.icon}
                </div>
                <div>
                  <span
                    className="rounded-md inline-block font-medium mb-1"
                    style={{ padding: '2px 8px', fontSize: 11, background: `color-mix(in oklch, ${selectedGuide.color} 12%, transparent)`, color: selectedGuide.color }}
                  >
                    {selectedGuide.category}
                  </span>
                  <h2 className="font-bold text-foreground" style={{ fontSize: 'var(--font-size-title)' }}>{selectedGuide.title}</h2>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-label)' }}>{selectedGuide.subtitle}</p>
                </div>
              </div>

              {/* 时效和热线信息 */}
              <div className="flex flex-wrap" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                {selectedGuide.timeLimit && (
                  <div
                    className="flex items-center rounded-lg"
                    style={{ gap: 6, padding: '6px 12px', background: 'color-mix(in oklch, var(--destructive) 8%, transparent)', border: '1px solid color-mix(in oklch, var(--destructive) 20%, transparent)' }}
                  >
                    <Clock size={13} style={{ color: 'var(--destructive)' }} />
                    <span style={{ fontSize: 12, color: 'var(--destructive)' }}>{selectedGuide.timeLimit}</span>
                  </div>
                )}
                {selectedGuide.hotline && (
                  <div
                    className="flex items-center rounded-lg"
                    style={{ gap: 6, padding: '6px 12px', background: 'color-mix(in oklch, var(--theme-green) 8%, transparent)', border: '1px solid color-mix(in oklch, var(--theme-green) 20%, transparent)' }}
                  >
                    <Phone size={13} style={{ color: 'var(--theme-green)' }} />
                    <span style={{ fontSize: 12, color: 'var(--theme-green)' }}>维权热线：{selectedGuide.hotline}</span>
                  </div>
                )}
              </div>

              {/* 维权步骤列表 */}
              <h3 className="font-semibold text-foreground mb-3" style={{ fontSize: 'var(--font-size-body)' }}>
                维权步骤（共 {selectedGuide.steps.length} 步）
              </h3>
              <div className="flex flex-col" style={{ gap: 'var(--spacing-sm)' }}>
                {selectedGuide.steps.map((s) => {
                  const expanded = expandedSteps.has(s.step);
                  return (
                    <div
                      key={s.step}
                      className="rounded-xl border border-border cursor-pointer overflow-hidden"
                      style={{ background: 'var(--background)', transition: 'border-color 0.15s' }}
                      onClick={() => toggleStep(s.step)}
                    >
                      {/* 步骤头部 */}
                      <div className="flex items-center" style={{ padding: '10px var(--spacing-md)', gap: 'var(--spacing-md)' }}>
                        {/* 步骤序号圆圈 */}
                        <div
                          className="rounded-full flex items-center justify-center shrink-0 font-bold"
                          style={{
                            width: 30,
                            height: 30,
                            background: selectedGuide.color,
                            color: '#fff',
                            fontSize: 13,
                          }}
                        >
                          {s.step}
                        </div>
                        <span className="flex-1 font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>{s.title}</span>
                        {expanded ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
                      </div>
                      {/* 步骤详情（可展开） */}
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)', paddingLeft: 58, borderTop: '1px solid var(--border)' }}>
                              <p className="text-muted-foreground mt-3" style={{ fontSize: 'var(--font-size-label)', lineHeight: 1.7 }}>{s.desc}</p>
                              {/* 温馨提示 */}
                              {s.tip && (
                                <div
                                  className="rounded-lg mt-2 flex items-start"
                                  style={{ gap: 8, padding: '8px 12px', background: `color-mix(in oklch, ${selectedGuide.color} 6%, transparent)`, border: `1px solid color-mix(in oklch, ${selectedGuide.color} 20%, transparent)` }}
                                >
                                  <CheckCircle2 size={13} style={{ color: selectedGuide.color, marginTop: 2, flexShrink: 0 }} />
                                  <span style={{ fontSize: 12, color: selectedGuide.color }}>{s.tip}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 重要提示卡片 */}
            <div className="rounded-xl border border-border bg-card" style={{ padding: 'var(--spacing-lg)' }}>
              <div className="flex items-center mb-3" style={{ gap: 8 }}>
                <AlertCircle size={16} style={{ color: 'var(--theme-gold)' }} />
                <h3 className="font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>重要提示</h3>
              </div>
              <div className="flex flex-col" style={{ gap: 6 }}>
                {selectedGuide.notes.map((note, i) => (
                  <div key={i} className="flex items-start" style={{ gap: 8 }}>
                    {/* 圆点装饰 */}
                    <div className="rounded-full shrink-0" style={{ width: 6, height: 6, background: 'var(--theme-gold)', marginTop: 7 }} />
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--font-size-label)', lineHeight: 1.6 }}>{note}</span>
                  </div>
                ))}
              </div>
              {/* 免责声明 */}
              <div
                className="rounded-lg mt-4 flex items-center"
                style={{ gap: 8, padding: '8px 12px', background: 'color-mix(in oklch, var(--muted) 30%, transparent)', border: '1px solid var(--border)' }}
              >
                <Scale size={13} className="text-muted-foreground shrink-0" />
                <span className="text-muted-foreground" style={{ fontSize: 11 }}>
                  本指引仅供参考，不构成法律意见。涉及重大权益，请咨询专业律师。
                </span>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
