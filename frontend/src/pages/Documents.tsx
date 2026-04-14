/**
 * 法律文书生成页面组件 (Documents.tsx)
 * 
 * 功能说明：
 * - 提供多种法律文书模板
 * - 用户填写表单信息
 * - AI自动生成专业法律文书
 * 
 * 支持的文书类型：
 * 1. 民事起诉状 - 向法院提起民事诉讼
 * 2. 答辩状 - 被告针对起诉进行答辩
 * 3. 劳动合同 - 用人单位与劳动者签订
 * 4. 律师函 - 催告对方履行义务
 */

import { useState } from 'react';
import { FileText, ChevronRight, Download, Eye, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, Stagger, HoverLift } from '@/components/MotionPrimitives';

/**
 * 文书模板配置数据结构
 */
interface DocTemplate {
  id: string;   // 模板唯一标识
  name: string; // 模板名称
  desc: string; // 模板描述
  category: string; // 所属分类
  fields: {   // 表单字段配置
    label: string;      // 字段标签
    key: string;        // 字段键名
    type: 'text' | 'textarea';  // 字段类型
    placeholder: string;        // 输入提示
  }[];
}

/**
 * 文书模板数据
 */
const templates: DocTemplate[] = [
  {
    id: 'lawsuit',
    name: '民事起诉状',
    desc: '向人民法院提起民事诉讼的法律文书',
    category: '诉讼文书',
    fields: [
      { label: '原告姓名', key: 'plaintiff', type: 'text', placeholder: '请输入原告姓名' },
      { label: '被告姓名', key: 'defendant', type: 'text', placeholder: '请输入被告姓名' },
      { label: '案由', key: 'cause', type: 'text', placeholder: '如：合同纠纷、劳动争议等' },
      { label: '诉讼请求', key: 'claims', type: 'textarea', placeholder: '请详细描述您的诉讼请求' },
      { label: '事实与理由', key: 'facts', type: 'textarea', placeholder: '请描述案件事实经过和理由' },
    ],
  },
  {
    id: 'defense',
    name: '答辩状',
    desc: '被告针对原告起诉进行答辩的法律文书',
    category: '诉讼文书',
    fields: [
      { label: '答辩人', key: 'respondent', type: 'text', placeholder: '请输入答辩人姓名' },
      { label: '原告', key: 'plaintiff', type: 'text', placeholder: '请输入原告姓名' },
      { label: '案号', key: 'caseNo', type: 'text', placeholder: '请输入案号' },
      { label: '答辩意见', key: 'defense', type: 'textarea', placeholder: '请详细描述答辩意见' },
    ],
  },
  {
    id: 'contract',
    name: '劳动合同',
    desc: '用人单位与劳动者之间的劳动协议',
    category: '合同协议',
    fields: [
      { label: '甲方（用人单位）', key: 'partyA', type: 'text', placeholder: '请输入用人单位名称' },
      { label: '乙方（劳动者）', key: 'partyB', type: 'text', placeholder: '请输入劳动者姓名' },
      { label: '工作内容', key: 'jobDesc', type: 'textarea', placeholder: '请描述工作岗位和职责' },
      { label: '合同期限', key: 'term', type: 'text', placeholder: '如：2025年1月1日至2027年12月31日' },
      { label: '劳动报酬', key: 'salary', type: 'text', placeholder: '请输入月薪金额' },
    ],
  },
  {
    id: 'demand',
    name: '律师函',
    desc: '律师代为发出的法律文书，催告对方履行义务',
    category: '函件',
    fields: [
      { label: '委托人', key: 'client', type: 'text', placeholder: '请输入委托人姓名' },
      { label: '相对方', key: 'recipient', type: 'text', placeholder: '请输入收件方名称' },
      { label: '主要事由', key: 'matter', type: 'textarea', placeholder: '请描述函件的主要事由' },
      { label: '要求事项', key: 'demands', type: 'textarea', placeholder: '请描述具体要求' },
    ],
  },
];

/**
 * 文书生成页面主组件
 */
export default function Documents() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate | null>(null); // 选中的模板
  const [formData, setFormData] = useState<Record<string, string>>({});  // 表单数据
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);   // 生成的文书
  const [generating, setGenerating] = useState(false);                     // 生成中状态

  /**
   * 执行文书生成
   * 模拟AI生成过程
   */
  const handleGenerate = () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    // 模拟1.5秒生成延迟
    setTimeout(() => {
      const doc = generateDocument(selectedTemplate, formData);
      setGeneratedDoc(doc);
      setGenerating(false);
    }, 1500);
  };

  /**
   * 返回模板列表
   * 重置所有状态
   */
  const handleBack = () => {
    setSelectedTemplate(null);
    setFormData({});
    setGeneratedDoc(null);
  };

  /**
   * 模板选择视图
   * 显示所有可用模板卡片
   */
  if (!selectedTemplate) {
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
              法律文书生成
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-body)' }}>
              选择文书模板，填写关键信息，AI自动生成专业法律文书
            </p>
          </FadeIn>

          {/* 模板卡片网格 */}
          <Stagger className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--spacing-md)' }}>
            {templates.map((t) => (
              <HoverLift key={t.id}>
                <button
                  onClick={() => setSelectedTemplate(t)}
                  className="w-full text-left rounded-xl border border-border bg-card cursor-pointer group"
                  style={{
                    padding: 'var(--spacing-lg)',
                    boxShadow: 'var(--ds-shadow-sm)',
                    transition: 'var(--duration-fast) var(--ease-default)',
                  }}
                >
                  <div className="flex items-start" style={{ gap: 'var(--spacing-md)' }}>
                    {/* 模板图标 */}
                    <div
                      className="shrink-0 flex items-center justify-center rounded-lg"
                      style={{
                        width: 48,
                        height: 48,
                        background: 'color-mix(in oklch, var(--theme-gold) 12%, transparent)',
                      }}
                    >
                      <FileText size={24} style={{ color: 'var(--theme-gold)' }} />
                    </div>
                    <div className="flex-1">
                      {/* 标题和箭头 */}
                      <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                        <h3
                          className="font-semibold text-foreground"
                          style={{ fontSize: 'var(--font-size-body)' }}
                        >
                          {t.name}
                        </h3>
                        <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary" />
                      </div>
                      {/* 分类标签 */}
                      <span
                        className="rounded-md"
                        style={{
                          display: 'inline-block',
                          padding: '1px var(--spacing-xs)',
                          fontSize: 'var(--font-size-small)',
                          background: 'color-mix(in oklch, var(--primary) 8%, transparent)',
                          color: 'var(--primary)',
                          marginTop: 4,
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        {t.category}
                      </span>
                      {/* 描述 */}
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-label)' }}>
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </button>
              </HoverLift>
            ))}
          </Stagger>
        </div>
      </div>
    );
  }

  /**
   * 表单填写 / 预览视图
   */
  return (
    <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', minHeight: 'calc(100vh - 65px)' }}>
      <div className="container max-w-3xl">
        {/* 返回按钮 */}
        <FadeIn>
          <button
            onClick={handleBack}
            className="flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
            style={{
              gap: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-label)',
              marginBottom: 'var(--spacing-lg)',
              transition: 'var(--duration-fast) var(--ease-default)',
            }}
          >
            <ArrowLeft size={16} /> 返回模板列表
          </button>
        </FadeIn>

        {/* 未生成文书时显示表单 */}
        {!generatedDoc ? (
          <FadeIn>
            <div
              className="rounded-xl border border-border bg-card"
              style={{ padding: 'var(--spacing-xl)', boxShadow: 'var(--ds-shadow-sm)' }}
            >
              <h2
                className="font-bold text-foreground"
                style={{
                  fontSize: 'var(--font-size-title)',
                  marginBottom: 'var(--spacing-lg)',
                }}
              >
                {selectedTemplate.name}
              </h2>

              {/* 表单字段列表 */}
              <div className="flex flex-col" style={{ gap: 'var(--spacing-md)' }}>
                {selectedTemplate.fields.map((field) => (
                  <div key={field.key}>
                    <label
                      className="block font-medium text-foreground"
                      style={{
                        fontSize: 'var(--font-size-label)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      {field.label}
                    </label>
                    {/* 根据字段类型渲染不同输入组件 */}
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-ring"
                        style={{
                          padding: 'var(--spacing-sm)',
                          fontSize: 'var(--font-size-body)',
                          resize: 'vertical',
                          transition: 'var(--duration-fast) var(--ease-default)',
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-ring"
                        style={{
                          padding: 'var(--spacing-sm)',
                          fontSize: 'var(--font-size-body)',
                          transition: 'var(--duration-fast) var(--ease-default)',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 生成按钮 */}
              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="cursor-pointer w-full"
                  size="lg"
                  style={{
                    background: 'var(--primary)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  {generating ? (
                    <>
                      <Sparkles size={18} className="animate-pulse" style={{ marginRight: 'var(--spacing-xs)' }} />
                      AI正在生成文书...
                    </>
                  ) : (
                    <>
                      <FileText size={18} style={{ marginRight: 'var(--spacing-xs)' }} />
                      生成文书
                    </>
                  )}
                </Button>
              </div>
            </div>
          </FadeIn>
        ) : (
          /**
           * 已生成文书时显示预览
           */
          <FadeIn>
            <div
              className="rounded-xl border border-border bg-card"
              style={{ padding: 'var(--spacing-xl)', boxShadow: 'var(--ds-shadow-sm)' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2
                  className="font-bold text-foreground"
                  style={{ fontSize: 'var(--font-size-title)' }}
                >
                  文书预览
                </h2>
                {/* 预览和下载按钮 */}
                <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <Eye size={14} style={{ marginRight: 4 }} /> 预览
                  </Button>
                  <Button size="sm" className="cursor-pointer">
                    <Download size={14} style={{ marginRight: 4 }} /> 下载
                  </Button>
                </div>
              </div>

              {/* 文书内容预览 */}
              <div
                className="rounded-lg border border-border bg-background"
                style={{
                  padding: 'var(--spacing-xl)',
                  fontSize: 'var(--font-size-body)',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  minHeight: 400,
                  color: 'var(--foreground)',
                }}
              >
                {generatedDoc}
              </div>

              {/* 重新编辑按钮 */}
              <div className="flex justify-end" style={{ marginTop: 'var(--spacing-lg)', gap: 'var(--spacing-sm)' }}>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedDoc(null)}
                  className="cursor-pointer"
                >
                  重新编辑
                </Button>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

/**
 * 根据模板和表单数据生成文书内容
 * @param template - 文书模板
 * @param data - 用户填写的表单数据
 * @returns 格式化后的文书文本
 */
function generateDocument(template: DocTemplate, data: Record<string, string>): string {
  // 获取字段值，提供默认值
  const p = (key: string, fallback: string) => data[key] || `[${fallback}]`;

  switch (template.id) {
    case 'lawsuit':
      // 生成民事起诉状
      return `民 事 起 诉 状

原告：${p('plaintiff', '原告姓名')}
被告：${p('defendant', '被告姓名')}

案由：${p('cause', '案由')}

诉讼请求：
${p('claims', '诉讼请求')}

事实与理由：
${p('facts', '事实与理由')}

综上所述，原告的合法权益受到侵害，特依据《中华人民共和国民事诉讼法》相关规定，向贵院提起诉讼，请求依法支持原告的全部诉讼请求。

此致
[受诉法院名称] 人民法院

                          具状人：${p('plaintiff', '原告姓名')}
                          日  期：${new Date().toLocaleDateString('zh-CN')}

附：
1. 本起诉状副本 ___ 份
2. 证据材料 ___ 份`;

    case 'defense':
      // 生成答辩状
      return `答 辩 状

答辩人：${p('respondent', '答辩人')}
案  号：${p('caseNo', '案号')}

针对原告 ${p('plaintiff', '原告')} 的诉讼请求，答辩如下：

${p('defense', '答辩意见')}

综上所述，原告的诉讼请求缺乏事实和法律依据，请求人民法院依法驳回原告的全部诉讼请求。

此致
人民法院

                          答辩人：${p('respondent', '答辩人')}
                          日  期：${new Date().toLocaleDateString('zh-CN')}`;

    case 'contract':
      // 生成劳动合同
      return `劳 动 合 同

甲方（用人单位）：${p('partyA', '用人单位名称')}
乙方（劳  动  者）：${p('partyB', '劳动者姓名')}

根据《中华人民共和国劳动合同法》及相关法律法规规定，甲乙双方在平等自愿、协商一致的基础上，签订本劳动合同。

一、合同期限
本合同期限为：${p('term', '合同期限')}

二、工作内容与工作地点
${p('jobDesc', '工作内容')}

三、劳动报酬
乙方月工资为人民币 ${p('salary', '金额')} 元，甲方于每月15日前支付上月工资。

四、工作时间与休息休假
实行标准工时制度，每日工作8小时，每周工作40小时。

五、社会保险与福利待遇
甲方依法为乙方缴纳社会保险费。

甲方（盖章）：              乙方（签字）：
日  期：${new Date().toLocaleDateString('zh-CN')}`;

    case 'demand':
      // 生成律师函
      return `律 师 函

致：${p('recipient', '相对方')}

受 ${p('client', '委托人')} 委托，本律师就以下事宜致函贵方：

一、事由
${p('matter', '主要事由')}

二、律师意见
根据《中华人民共和国民法典》等相关法律法规的规定，贵方的上述行为已构成违约/侵权，依法应当承担相应的法律责任。

三、要求
${p('demands', '要求事项')}

请贵方在收到本函之日起 15 日内，积极妥善处理上述事宜。逾期未果，委托人将通过法律途径维护自身合法权益。

特此函告。

                          律师事务所
                          律师：_______________
                          日期：${new Date().toLocaleDateString('zh-CN')}`;

    default:
      return '文书生成失败，请重试。';
  }
}
