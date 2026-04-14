/**
 * 案例智能检索页面组件 (Cases.tsx)
 * 
 * 功能说明：
 * - 提供法律案例的关键词检索功能
 * - 支持按案件类型筛选
 * - 展示案例的详细信息、裁判结果和相关法条
 * 
 * 主要特性：
 * 1. Mock案例数据 - 预置4个示例案例
 * 2. 关键词搜索 - 支持按标题、摘要、类型搜索
 * 3. 类型筛选 - 6种案件类型可选
 * 4. 相关度展示 - 显示与搜索条件的匹配程度
 * 5. 详情展开 - 点击案例卡片展开查看完整信息和裁判结果
 */

import { useState } from 'react';
import { Search, Filter, Calendar, Building2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';

/**
 * 案例数据结构
 */
interface CaseItem {
  id: string;           // 案例唯一标识
  title: string;        // 案例标题
  court: string;        // 审理法院
  date: string;         // 裁判日期
  type: string;         // 案件类型
  summary: string;      // 案件摘要
  result: string;       // 裁判结果
  laws: string[];       // 涉及法条
  relevance: number;    // 相关度百分比
}

/**
 * Mock 案例数据
 * 包含不同类型的典型法律案例
 */
const mockCases: CaseItem[] = [
  {
    id: '1',
    title: '张某与李某劳动合同纠纷案',
    court: '北京市朝阳区人民法院',
    date: '2024-06-15',
    type: '劳动争议',
    summary: '原告张某主张被告公司违法解除劳动合同，要求支付赔偿金及未休年假工资。法院审理认为用人单位未依法定程序解除合同，支持原告诉请。',
    result: '判决被告支付赔偿金12万元，未休年假工资8000元。',
    laws: ['《劳动合同法》第四十八条', '《劳动合同法》第八十七条'],
    relevance: 98,
  },
  {
    id: '2',
    title: '王某与某科技公司竞业限制纠纷案',
    court: '上海市浦东新区人民法院',
    date: '2024-03-22',
    type: '劳动争议',
    summary: '被告离职后违反竞业限制协议入职同行业公司，原告要求支付违约金。法院综合考量竞业限制合理性和补偿金支付情况作出判决。',
    result: '判决被告支付违约金30万元。',
    laws: ['《劳动合同法》第二十三条', '《劳动合同法》第二十四条'],
    relevance: 92,
  },
  {
    id: '3',
    title: '陈某与某房地产公司商品房买卖合同纠纷',
    court: '广州市天河区人民法院',
    date: '2024-01-10',
    type: '合同纠纷',
    summary: '原告购买商品房后发现面积缩水超过3%，要求退房并赔偿损失。法院依据合同约定和法律规定支持原告退房请求。',
    result: '判决解除合同，被告返还房款并赔偿损失。',
    laws: ['《民法典》第五百七十七条', '《最高人民法院关于审理商品房买卖合同纠纷案件适用法律若干问题的解释》'],
    relevance: 85,
  },
  {
    id: '4',
    title: '刘某网络购物消费者权益纠纷案',
    court: '深圳市南山区人民法院',
    date: '2024-05-08',
    type: '消费者权益',
    summary: '原告网购商品涉嫌虚假宣传，要求退一赔三。法院认定商家构成欺诈，适用惩罚性赔偿。',
    result: '判决商家退还货款并三倍赔偿。',
    laws: ['《消费者权益保护法》第五十五条'],
    relevance: 80,
  },
];

/**
 * 案件类型列表
 * 用于筛选下拉选择
 */
const caseTypes = ['全部类型', '劳动争议', '合同纠纷', '消费者权益', '知识产权', '侵权责任'];

/**
 * 案例检索页面主组件
 */
export default function Cases() {
  const [query, setQuery] = useState('');           // 搜索关键词
  const [selectedType, setSelectedType] = useState('全部类型'); // 选中的案件类型
  const [results, setResults] = useState<CaseItem[]>([]); // 搜索结果
  const [searched, setSearched] = useState(false);   // 是否已搜索
  const [expandedId, setExpandedId] = useState<string | null>(null); // 展开的案例ID

  /**
   * 执行搜索
   * 根据关键词和类型筛选案例
   */
  const handleSearch = () => {
    setSearched(true);
    let filtered = mockCases;  // 从所有Mock数据开始筛选
    
    // 关键词筛选：匹配标题、摘要或类型
    if (query.trim()) {
      filtered = filtered.filter(
        (c) => c.title.includes(query) || c.summary.includes(query) || c.type.includes(query)
      );
    }
    
    // 类型筛选
    if (selectedType !== '全部类型') {
      filtered = filtered.filter((c) => c.type === selectedType);
    }
    
    // 如果没有匹配结果，显示所有数据（模拟"找相似"效果）
    setResults(filtered.length > 0 ? filtered : mockCases);
  };

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
            案例智能检索
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
            输入关键词或案件描述，智能匹配相关法律案例
          </p>
        </FadeIn>

        {/* 搜索框 */}
        <FadeIn delay={0.1} style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div
            className="flex items-center rounded-xl border border-border bg-card"
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              boxShadow: 'var(--ds-shadow-sm)',
            }}
          >
            <Search size={20} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入案件关键词、案由或法律问题描述..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-sm)',
                fontSize: 'var(--font-size-body)',
              }}
            />
            <Button onClick={handleSearch} className="cursor-pointer shrink-0">
              检索
            </Button>
          </div>
        </FadeIn>

        {/* 类型筛选按钮组 */}
        <FadeIn delay={0.15} style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-xs)' }}>
            <Filter size={16} className="text-muted-foreground" />
            {caseTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-md cursor-pointer ${
                  selectedType === t
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: selectedType === t ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                  transition: 'var(--duration-fast) var(--ease-default)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* 搜索结果列表 */}
        {searched && (
          <div>
            {/* 结果数量提示 */}
            <div
              className="text-muted-foreground"
              style={{ fontSize: 'var(--font-size-label)', marginBottom: 'var(--spacing-md)' }}
            >
              共找到 {results.length} 个相关案例
            </div>
            
            {/* 案例卡片列表 */}
            <Stagger className="flex flex-col" style={{ gap: 'var(--spacing-md)' }}>
              {results.map((c) => (
                <HoverLift key={c.id} lift={-2}>
                  <div
                    className="rounded-xl border border-border bg-card cursor-pointer"
                    style={{ padding: 'var(--spacing-lg)', boxShadow: 'var(--ds-shadow-sm)' }}
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                  >
                    <div className="flex items-start justify-between" style={{ gap: 'var(--spacing-md)' }}>
                      <div className="flex-1">
                        {/* 标题和类型标签 */}
                        <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                          <h3
                            className="font-semibold text-foreground"
                            style={{ fontSize: 'var(--font-size-body)' }}
                          >
                            {c.title}
                          </h3>
                          {/* 案件类型标签 */}
                          <span
                            className="rounded-md"
                            style={{
                              padding: '1px var(--spacing-xs)',
                              fontSize: 'var(--font-size-small)',
                              background: 'color-mix(in oklch, var(--theme-blue) 10%, transparent)',
                              color: 'var(--theme-blue)',
                            }}
                          >
                            {c.type}
                          </span>
                        </div>
                        
                        {/* 法院和日期信息 */}
                        <div
                          className="flex items-center flex-wrap text-muted-foreground"
                          style={{
                            gap: 'var(--spacing-md)',
                            fontSize: 'var(--font-size-small)',
                            marginBottom: 'var(--spacing-sm)',
                          }}
                        >
                          <span className="flex items-center" style={{ gap: 4 }}>
                            <Building2 size={13} /> {c.court}
                          </span>
                          <span className="flex items-center" style={{ gap: 4 }}>
                            <Calendar size={13} /> {c.date}
                          </span>
                        </div>
                        
                        {/* 案件摘要 */}
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize: 'var(--font-size-label)',
                            lineHeight: 'var(--line-height)',
                          }}
                        >
                          {c.summary}
                        </p>
                      </div>
                      
                      {/* 相关度显示 */}
                      <div
                        className="shrink-0 flex flex-col items-center rounded-lg"
                        style={{
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          background: 'color-mix(in oklch, var(--success) 10%, transparent)',
                        }}
                      >
                        <span className="font-bold" style={{ color: 'var(--success)', fontSize: 'var(--font-size-body)' }}>
                          {c.relevance}%
                        </span>
                        <span style={{ color: 'var(--success)', fontSize: 'var(--font-size-small)' }}>
                          相关度
                        </span>
                      </div>
                    </div>

                    {/* 展开详情区域 */}
                    {expandedId === c.id && (
                      <div
                        className="border-t border-border"
                        style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)' }}
                      >
                        {/* 裁判结果 */}
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <span
                            className="font-semibold text-foreground"
                            style={{ fontSize: 'var(--font-size-label)' }}
                          >
                            裁判结果：
                          </span>
                          <span className="text-foreground" style={{ fontSize: 'var(--font-size-label)' }}>
                            {c.result}
                          </span>
                        </div>
                        
                        {/* 涉及法条 */}
                        <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-xs)' }}>
                          <BookOpen size={14} className="text-muted-foreground" />
                          {c.laws.map((law) => (
                            <span
                              key={law}
                              className="rounded-md"
                              style={{
                                padding: '2px var(--spacing-xs)',
                                fontSize: 'var(--font-size-small)',
                                background: 'color-mix(in oklch, var(--theme-gold) 12%, transparent)',
                                color: 'var(--theme-gold)',
                              }}
                            >
                              {law}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </HoverLift>
              ))}
            </Stagger>
          </div>
        )}

        {/* 搜索前显示的空状态提示 */}
        {!searched && (
          <FadeIn className="text-center" style={{ paddingTop: 'var(--spacing-2xl)' }}>
            <Search size={48} className="text-muted-foreground mx-auto" style={{ marginBottom: 'var(--spacing-md)', opacity: 0.3 }} />
            <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
              输入关键词开始检索法律案例
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
