/**
 * ============================================================================
 *  法律术语百科页面 (Encyclopedia.tsx)
 * ============================================================================
 *
 * 【页面功能】
 *   本页面以通俗易懂的方式解释常见法律术语，帮助普通用户理解专业法律概念。
 *   每个术语配有通俗解释、详细说明、真实案例和相关词条链接。
 *
 * 【主要特性】
 *   1. 包含 25 个常用法律术语，涵盖民事诉讼、合同法、刑法、劳动法等类别
 *   2. 提供通俗易懂的白话解释（plain 字段）
 *   3. 每个术语配有真实案例帮助理解
 *   4. 支持按分类筛选和关键词搜索
 *   5. 可展开查看详情和相关词条
 *
 * 【数据来源】
 *   内置模拟数据，包含诉讼时效、举证责任、不可抗力、正当防卫等常见术语
 * ============================================================================
 */

// ─── 导入依赖 ────────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { GraduationCap, Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { FadeIn, Stagger } from '@/components/MotionPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Term: 法律术语的数据结构
 * - id: 术语的唯一标识符
 * - term: 术语名称（如"诉讼时效"）
 * - category: 所属法律类别（民事诉讼、合同法、刑法等）
 * - plain: 通俗解释（用简单语言描述）
 * - detail: 详细说明（法律定义和要点）
 * - example: 真实案例（可选）
 * - related: 相关词条列表（可选）
 */
interface Term {
  id: string;
  term: string;
  category: string;
  plain: string;
  detail: string;
  example?: string;
  related?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 【法律术语数据库】包含 25 个常用法律术语
// ═══════════════════════════════════════════════════════════════════════════════
const TERMS: Term[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 【民事诉讼类】
  // ═══════════════════════════════════════════════════════════════════════════
  // 诉讼时效：打官司的"截止日期"，一般民事案件 3 年时效
  { id: '1', term: '诉讼时效', category: '民事诉讼', plain: '打官司的"截止日期"', detail: '诉讼时效是指权利人在法定期间内不行使权利，就丧失胜诉权的制度。一般民事诉讼时效为3年，从权利人知道或应当知道权利被侵害之日起计算。', example: '张三借钱给李四，到期不还，张三必须在3年内起诉，否则法院可能不支持其请求。', related: ['胜诉权', '权利人', '起诉'] },
  { id: '2', term: '举证责任', category: '民事诉讼', plain: '谁主张谁举证', detail: '举证责任是指当事人对自己提出的主张，有提供证据加以证明的责任。民事诉讼中基本原则是"谁主张，谁举证"，但侵权责任中某些情形实行举证责任倒置。', example: '消费者起诉商品缺陷造成人身损害，由生产者举证证明产品没有缺陷。', related: ['证明责任', '证据', '举证倒置'] },
  { id: '3', term: '不可抗力', category: '合同法', plain: '天灾人祸免责条款', detail: '不可抗力是指不能预见、不能避免并不能克服的客观情况，如自然灾害、战争、政府行为等。当事人因不可抗力不能履行合同的，根据影响程度部分或全部免除责任，但需及时通知对方。', example: '疫情防控期间，酒店因政府命令关闭，无法为客人提供住宿服务，可主张不可抗力免责。', related: ['情势变更', '违约责任', '免责条款'] },
  { id: '4', term: '违约金', category: '合同法', plain: '违约的"罚款"', detail: '违约金是合同当事人在合同中预先约定的，一方违约时应向对方支付的一定数额金钱。违约金可以约定，也可以由法律直接规定。若违约金过高（超过实际损失的30%），法院可以适当调减。', example: '购房合同约定买方逾期付款按日0.03%支付违约金，买方逾期30天付款，需额外支付房款×0.03%×30天。', related: ['赔偿损失', '定金', '损害赔偿'] },
  { id: '5', term: '善意取得', category: '物权法', plain: '买到"来路不明"财物也有保护', detail: '善意取得是指无权处分人将动产或不动产转让给善意第三人时，善意第三人依法取得该财产的所有权，原权利人不得追回的制度。需满足：受让人善意（不知情）、支付合理价格、依法办理登记。', example: '甲将乙的手机出售给不知情的丙，丙以合理价格购买，丙取得手机所有权，乙只能向甲索赔。', related: ['无权处分', '占有', '物权'] },
  { id: '6', term: '连带责任', category: '民事责任', plain: '几个人一起赔，每个人都要全赔', detail: '连带责任是指数个当事人就同一债务，各自负有全部履行义务，债权人可以向任何一人或几人同时请求全部清偿的责任形式。常见于共同侵权、共同担保、合伙债务等场合。', example: '甲乙共同借款10万，债权人可以向甲或乙任一方要求偿还全部10万元。', related: ['按份责任', '共同债务', '担保责任'] },
  { id: '7', term: '情势变更', category: '合同法', plain: '合同签完后环境大变，可以重谈', detail: '情势变更是指合同订立后，作为合同基础的客观情况发生了当事人无法预见的重大变化，若继续履行合同对当事人明显不公平，当事人可请求变更或解除合同。与不可抗力不同，情势变更不导致履行不能，只是显失公平。', example: '签订长期供货合同后，原材料价格暴涨300%，继续履行将导致严重亏损，可申请变更合同价格。', related: ['不可抗力', '合同解除', '显失公平'] },
  { id: '8', term: '代位权', category: '合同法', plain: '债权人代替债务人追债', detail: '代位权是指债务人怠于行使其对第三人的到期债权，对债权人造成损害时，债权人可以向法院请求以自己的名义代位行使债务人对第三人的债权。', example: '甲欠乙100万，丙欠甲100万。甲有钱却不向丙追债也不还乙，乙可直接起诉丙，要求丙向乙还款。', related: ['撤销权', '债权人权利', '次债务人'] },
  { id: '9', term: '撤销权', category: '合同法', plain: '阻止债务人"转移财产"', detail: '撤销权是指债务人无偿转让财产或以明显不合理低价转让财产，损害债权人利益时，债权人可向法院请求撤销该行为的权利。需在知道撤销原因之日起1年内行使，最长不超过5年。', example: '甲欠银行100万，为逃债将房产以1万元"卖"给亲属，银行可申请法院撤销该转让行为。', related: ['代位权', '恶意转移财产', '欺诈转移'] },
  { id: '10', term: '正当防卫', category: '刑法', plain: '见义勇为的法律保护', detail: '正当防卫是指为了保护国家、公共利益、本人或他人的合法权益，对正在进行的不法侵害实施的反击行为。正当防卫不负刑事责任，但明显超过必要限度造成重大损害的，构成防卫过当。', example: '甲持刀袭击乙，乙抢夺甲的刀将其刺伤，属于正当防卫，不承担刑事责任。', related: ['紧急避险', '防卫过当', '无限防卫权'] },
  { id: '11', term: '共同犯罪', category: '刑法', plain: '一起犯罪，按角色定罪', detail: '共同犯罪是指二人以上共同故意犯罪。共同犯罪中分为主犯（起主要作用）和从犯（起次要、辅助作用）。主犯按其犯罪行为全部处罚，从犯从轻、减轻或免除处罚。', example: '甲策划抢劫，乙负责望风，甲是主犯，乙是从犯，乙可以从轻处罚。', related: ['主犯', '从犯', '教唆犯'] },
  { id: '12', term: '假释', category: '刑法', plain: '提前出狱但有条件', detail: '假释是指对被判处有期徒刑、无期徒刑的犯罪分子，在执行一定刑期后，因认真遵守监规、接受教育改造、确有悔改表现，不致再危害社会，而附条件提前释放的制度。假释期间再犯罪，撤销假释收监执行。', example: '张某被判10年，执行5年后表现良好获得假释，在假释考验期内须遵守监管规定。', related: ['减刑', '缓刑', '刑满释放'] },
  { id: '13', term: '缓刑', category: '刑法', plain: '判了刑但暂不关人', detail: '缓刑是指对于被判处拘役、三年以下有期徒刑的犯罪分子，根据犯罪情节和悔罪表现，认为暂不执行所判刑罚，设定考验期限，若考验期内无违法行为则原判刑罚不再执行的制度。', example: '初犯、认罪态度好、社会危害性小，法院判处1年有期徒刑缓期2年执行，不用坐牢但受监督。', related: ['假释', '免于刑事处罚', '暂予监外执行'] },
  { id: '14', term: '劳动仲裁', category: '劳动法', plain: '解决劳动纠纷的免费机构', detail: '劳动仲裁是劳动争议诉讼的前置程序，由劳动争议仲裁委员会负责裁决。申请免费，一般45天内结案，对结果不服可在15日内向法院提起诉讼。仲裁时效为1年，从知道或应当知道权利被侵害之日起计算。', example: '员工被违法辞退，应先向劳动仲裁委申请仲裁，不能直接起诉（部分案件一裁终局除外）。', related: ['劳动监察', '劳动诉讼', '经济补偿金'] },
  // ═══════════════════════════════════════════════════════════════════════════
  // 【消费者权益类】
  // ═══════════════════════════════════════════════════════════════════════════
  // 知情权：消费者有权知道商品真实信息
  { id: '15', term: '经济补偿金', category: '劳动法', plain: '离职时公司应付的"买断费"', detail: '经济补偿金是用人单位依法解除或终止劳动合同时，应向劳动者支付的补偿，俗称"N"。计算标准：工作每满1年支付1个月工资，6个月以上不满1年按1年计算，不满6个月支付半个月工资。', example: '工作3年6个月，月薪1万，合法解除可获经济补偿金：4×1万=4万元。', related: ['赔偿金', '违法解除', '劳动合同'] },
  { id: '16', term: '试用期', category: '劳动法', plain: '上班头几个月的考察期', detail: '试用期是劳动合同中约定的用人单位与劳动者互相了解、考察的期限。同一用人单位同一劳动者只能约定一次试用期，期限根据合同期限而定（1年以内合同试用期最长1个月，3年以上合同最长6个月）。试用期工资不得低于转正工资80%。', example: '签了3年合同约定6个月试用期，试用期工资不能低于转正工资的80%，也不能低于当地最低工资标准。', related: ['劳动合同', '违法试用期', '试用期辞退'] },
  { id: '17', term: '知情权', category: '消费者权益', plain: '消费者有权知道商品真实信息', detail: '知情权是消费者享有知悉其购买、使用的商品或接受服务的真实情况的权利，包括：商品价格、产地、生产者、用途、性能、规格、等级、主要成份、生产日期、有效期限、检验合格证明、使用方法说明、售后服务等信息。', example: '商家隐瞒二手车的事故历史，消费者购买后发现，可主张撤销合同并要求赔偿。', related: ['欺诈行为', '虚假宣传', '惩罚性赔偿'] },
  { id: '18', term: '无效合同', category: '合同法', plain: '从一开始就没有法律效力的合同', detail: '无效合同是指因违反法律强制性规定或违背公序良俗，自始不具有法律约束力的合同。常见情形：违反法律行政法规强制性规定、恶意串通损害他人利益、以合法形式掩盖非法目的、违背公序良俗等。', example: '甲乙签订购买违禁枪支的合同，因违反法律强制性规定，合同无效，双方均不受法律保护。', related: ['可撤销合同', '效力待定合同', '合同解除'] },
  { id: '19', term: '驰名商标', category: '知识产权', plain: '全国著名品牌的特殊保护', detail: '驰名商标是指在中国境内为相关公众广为知晓，并享有较高声誉的商标。驰名商标享有跨类别保护，即使在不同商品类别上，也可禁止他人使用相同或近似商标。驰名商标认定采用"被动认定、个案认定"原则。', example: '即使茅台的商标是在白酒类别，其他类别的商品也不能使用"茅台"字样，以防混淆。', related: ['商标注册', '侵犯商标权', '仿冒'] },
  { id: '20', term: '著作权自动产生', category: '知识产权', plain: '作品创作完成即有版权，无需注册', detail: '著作权自作品创作完成之日起自动产生，无需登记注册。但著作权登记可作为权利归属的初步证据，在侵权纠纷中举证更方便。作者身故后50年内，作品仍受著作权保护（人身权利永久保护）。', example: '写完一篇文章发布到网上，著作权自动属于作者，他人转载需经授权。', related: ['著作权登记', '侵犯著作权', '合理使用'] },
  { id: '21', term: '个人信息', category: '数据安全', plain: '能识别你身份的各类信息', detail: '个人信息是以电子或其他方式记录的、与已识别或可识别自然人有关的各种信息，包括：姓名、身份证号、手机号、电子邮件、住址、行踪轨迹、消费记录、生物特征（指纹、人脸）等。匿名化处理后的信息不属于个人信息。', example: '网购平台收集用户手机号、地址，即为个人信息，须经用户同意且不得超出服务范围使用。', related: ['敏感个人信息', '知情同意', '数据安全'] },
  // ═══════════════════════════════════════════════════════════════════════════
  // 【继承法类】
  // ═══════════════════════════════════════════════════════════════════════════
  // 继承顺序：遗产按亲疏关系顺序分配
  { id: '22', term: '继承顺序', category: '继承法', plain: '遗产按亲疏关系顺序分配', detail: '法定继承按照顺序进行：第一顺序为配偶、子女、父母；第二顺序为兄弟姐妹、祖父母、外祖父母。有第一顺序继承人时，第二顺序继承人不继承。同一顺序继承人一般均等分配遗产。', example: '老王去世，留有妻子、子女、父母（均健在），由妻子、子女、父母平均继承遗产；兄弟不参与。', related: ['遗嘱继承', '代位继承', '遗产分割'] },
  { id: '23', term: '公证遗嘱', category: '继承法', plain: '效力最高的遗嘱形式', detail: '公证遗嘱是由遗嘱人经公证机关办理的遗嘱，在各种遗嘱形式中效力最高。根据2021年民法典，遗嘱效力规则改为：数份遗嘱内容抵触的，以最后遗嘱为准（不再公证遗嘱优先）。', example: '2020年立了公证遗嘱，2022年又自书遗嘱推翻，以2022年自书遗嘱为准（民法典施行后）。', related: ['遗嘱效力', '遗嘱形式', '遗嘱撤销'] },
  { id: '24', term: '房屋产权证', category: '房地产', plain: '房子归你的法律凭证', detail: '房屋产权证（不动产权证书）是房屋所有权的法定凭证，记载权利人、坐落位置、面积、用途等信息。不动产物权的设立、变更须依法登记，经登记才发生法律效力。无产权证的房屋转让存在法律风险。', example: '购买二手房必须办理产权过户登记，产权证更名前房屋法律上仍属于原房主。', related: ['不动产登记', '产权过户', '抵押登记'] },
  { id: '25', term: '预售许可证', category: '房地产', plain: '期房销售的合法资质', detail: '商品房预售许可证是房地产开发企业将正在建造的房屋（期房）向社会销售，必须取得的政府批准证件。购买期房时，应查验开发商是否取得预售许可证，否则签订的预售合同无效，购房者可要求退款。', example: '购房者购买期房前应在网上查询预售许可证，确认楼栋在许可范围内再签合同付款。', related: ['商品房预售', '期房', '购房合同'] },
];

// ─── 常量：术语分类筛选列表 ───────────────────────────────────────────────────
const CATEGORIES = ['全部', '民事诉讼', '合同法', '物权法', '民事责任', '刑法', '劳动法', '消费者权益', '知识产权', '数据安全', '继承法', '房地产'];

// ═══════════════════════════════════════════════════════════════════════════════
// 【主组件】法律术语百科页面
// ═══════════════════════════════════════════════════════════════════════════════
export default function Encyclopedia() {
  // ─── 状态管理 ──────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState('');           // 搜索关键词状态
  const [activeCategory, setActiveCategory] = useState('全部');  // 当前选中的分类
  const [expandedId, setExpandedId] = useState<string | null>(null);  // 当前展开的术语 ID

  // ─── 筛选结果计算（useMemo 缓存优化）──────────────────────────────────────
  // 同时匹配关键词（术语名称、通俗解释、详细内容、分类）和分类筛选
  const filtered = useMemo(() => {
    return TERMS.filter((t) => {
      const kw = keyword.trim();
      const matchKw = !kw || t.term.includes(kw) || t.plain.includes(kw) || t.detail.includes(kw) || t.category.includes(kw);
      const matchCat = activeCategory === '全部' || t.category === activeCategory;
      return matchKw && matchCat;
    });
  }, [keyword, activeCategory]);

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: 'var(--background)' }}>
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 【页面头部】渐变背景，包含标题和搜索框 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: 'linear-gradient(135deg, var(--hero) 0%, oklch(0.28 0.08 255) 100%)', padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
        <div className="container max-w-4xl">
          <FadeIn>
            {/* 页面标题 */}
            <div className="flex items-center mb-2" style={{ gap: 'var(--spacing-sm)' }}>
              <GraduationCap size={26} style={{ color: 'var(--theme-gold)' }} />
              <h1 className="font-bold" style={{ fontSize: 'var(--font-size-headline)', color: 'var(--hero-foreground)' }}>法律百科</h1>
            </div>
            <p style={{ color: 'oklch(0.80 0.01 250)', fontSize: 'var(--font-size-body)', marginBottom: 4 }}>
              白话法律科普，轻松掌握法律常识
            </p>
          </FadeIn>
          {/* 搜索栏 */}
          <FadeIn delay={0.1}>
            <div className="flex items-center rounded-xl bg-card border border-border mt-4" style={{ padding: '0 var(--spacing-md)', boxShadow: 'var(--ds-shadow-md)' }}>
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索法律术语，如：不可抗力、举证责任..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                style={{ padding: '12px var(--spacing-sm)', fontSize: 'var(--font-size-body)' }}
              />
              {keyword && <button onClick={() => setKeyword('')} className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">清除</button>}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="container max-w-4xl" style={{ padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* 【分类筛选栏】12 个法律类别按钮 */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <FadeIn style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="flex flex-wrap" style={{ gap: 'var(--spacing-xs)' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="rounded-lg cursor-pointer"
                style={{
                  padding: '5px 10px',
                  fontSize: 12,
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

        {/* 【搜索结果统计】 */}
        <div className="text-muted-foreground mb-4" style={{ fontSize: 'var(--font-size-label)' }}>
          共 {filtered.length} 个词条
          {keyword && <span>（含"<strong className="text-foreground">{keyword}</strong>"）</span>}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* 【术语卡片列表】点击展开查看详情 */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <Stagger className="flex flex-col" style={{ gap: 'var(--spacing-sm)' }}>
          {filtered.map((term) => {
            const expanded = expandedId === term.id;
            return (
              <div
                key={term.id}
                className="rounded-xl border border-border bg-card overflow-hidden cursor-pointer"
                style={{ boxShadow: 'var(--ds-shadow-sm)' }}
                onClick={() => setExpandedId(expanded ? null : term.id)}
              >
                {/* 术语头部：名称、分类、通俗解释、展开图标 */}
                <div className="flex items-center justify-between" style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
                  <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-sm)' }}>
                    {/* 术语名称 */}
                    <span className="font-bold text-foreground" style={{ fontSize: 'var(--font-size-body)' }}>{term.term}</span>
                    {/* 分类标签 */}
                    <span
                      className="rounded-md"
                      style={{ padding: '2px 8px', fontSize: 11, background: 'var(--secondary)', color: 'var(--muted-foreground)' }}
                    >
                      {term.category}
                    </span>
                    {/* 通俗解释 */}
                    <span className="text-muted-foreground" style={{ fontSize: 13 }}>— {term.plain}</span>
                  </div>
                  {expanded ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
                </div>

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* 【术语详情区域】展开后显示，包含详细说明、案例、相关词条 */}
                {/* ══════════════════════════════════════════════════════════════ */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: 'var(--spacing-md) var(--spacing-lg) var(--spacing-lg)', borderTop: '1px solid var(--border)' }}>
                        {/* 详细说明 */}
                        <p className="text-foreground mb-3" style={{ fontSize: 'var(--font-size-label)', lineHeight: 1.8 }}>{term.detail}</p>
                        {/* 真实案例（如果有） */}
                        {term.example && (
                          <div className="rounded-lg mb-3" style={{ padding: '10px 14px', background: 'color-mix(in oklch, var(--primary) 5%, transparent)', border: '1px solid color-mix(in oklch, var(--primary) 15%, transparent)' }}>
                            <span className="font-semibold text-primary" style={{ fontSize: 12 }}>📌 案例理解：</span>
                            <span className="text-muted-foreground" style={{ fontSize: 12, marginLeft: 4 }}>{term.example}</span>
                          </div>
                        )}
                        {/* 相关词条链接（如果有） */}
                        {term.related && term.related.length > 0 && (
                          <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
                            <span className="text-muted-foreground" style={{ fontSize: 12 }}>相关词条：</span>
                            {term.related.map((r) => (
                              <button
                                key={r}
                                onClick={(e) => { e.stopPropagation(); setKeyword(r); setExpandedId(null); }}
                                className="rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                style={{ padding: '2px 8px', fontSize: 11, background: 'var(--secondary)', color: 'var(--muted-foreground)' }}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {/* 无搜索结果提示 */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <BookOpen size={40} className="mx-auto text-muted-foreground mb-3" style={{ opacity: 0.3 }} />
              <p className="text-muted-foreground">未找到相关词条</p>
            </div>
          )}
        </Stagger>
      </div>
    </div>
  );
}
