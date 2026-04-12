/**
 * ============================================================================
 *  导航栏组件 (Navbar.tsx)
 * ============================================================================
 *
 * 【组件功能】
 *   律智通法律助手的全局导航栏组件，提供页面导航、搜索、帮助和登录功能。
 *   支持桌面端和移动端的响应式布局。
 *
 * 【主要特性】
 *   1. 包含 9 个主要导航链接（首页、智能咨询、案例检索等）
 *   2. 支持全局搜索，跳转到法规查询页面
 *   3. 响应式设计：桌面端水平导航，移动端折叠菜单
 *   4. 登录/注册模态框
 *   5. 显示当前页面的导航高亮状态
 *   6. 底部显示技术支持信息（腾讯元器·得理 AI）
 *
 * 【状态管理】
 *   - mobileOpen: 移动端菜单展开/收起状态
 *   - searchValue: 搜索框输入值
 *   - showLogin: 登录弹窗显示/隐藏状态
 * ============================================================================
 */

// ─── 导入依赖 ────────────────────────────────────────────────────────────────
import { Link, useLocation, useNavigate } from 'react-router-dom';  // React Router 路由导航
import { Scale, MessageSquare, Search, FileText, ShieldCheck, BookOpen, Menu, X, HelpCircle, User, Navigation, Calculator, GraduationCap } from 'lucide-react';  // lucide 图标
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';  // 动画库

/**
 * NavLink: 导航链接的数据结构
 * - to: 路由路径
 * - label: 显示文本
 * - icon: 图标组件
 */
const navLinks = [
  { to: '/', label: '首页', icon: Scale },
  { to: '/qa', label: '智能咨询', icon: MessageSquare },
  { to: '/cases', label: '案例检索', icon: Search },
  { to: '/laws', label: '法规查询', icon: BookOpen },
  { to: '/review', label: '合同审查', icon: ShieldCheck },
  { to: '/documents', label: '文书生成', icon: FileText },
  { to: '/guide', label: '维权指引', icon: Navigation },
  { to: '/calculator', label: '费用计算', icon: Calculator },
  { to: '/encyclopedia', label: '法律百科', icon: GraduationCap },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 【主组件】导航栏
// ═══════════════════════════════════════════════════════════════════════════════
export default function Navbar() {
  // ─── 路由和导航 ─────────────────────────────────────────────────────────────
  const location = useLocation();  // 获取当前路由路径
  const navigate = useNavigate();  // 编程式导航函数

  // ─── 状态管理 ──────────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);   // 移动端菜单展开状态
  const [searchValue, setSearchValue] = useState('');    // 搜索框输入值
  const [showLogin, setShowLogin] = useState(false);     // 登录弹窗显示状态

  // ─── 搜索处理函数 ──────────────────────────────────────────────────────────
  // 将搜索关键词编码后跳转到法规查询页面
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/laws?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 【主导航行】桌面端：Logo + 导航链接 + 搜索 + 帮助 + 登录 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="container flex items-center justify-between"
        style={{ padding: '10px var(--spacing-lg)', gap: 'var(--spacing-md)' }}
      >
        {/* ─── Logo 区域 ────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center shrink-0 cursor-pointer" style={{ gap: 8 }}>
          {/* Logo 图标（天平图标代表法律） */}
          <div
            className="flex items-center justify-center rounded-lg bg-primary shrink-0"
            style={{ width: 34, height: 34 }}
          >
            <Scale className="text-primary-foreground" size={18} />
          </div>
          {/* 品牌名称 */}
          <div className="flex flex-col leading-none">
            <span
              className="font-bold text-foreground"
              style={{ fontSize: 'var(--font-size-body)', letterSpacing: 'var(--letter-spacing-tight)' }}
            >
              智律通
            </span>
            {/* 副标题（小屏幕隐藏） */}
            <span
              className="text-muted-foreground hidden sm:block"
              style={{ fontSize: 10 }}
            >
              普惠法律智能助手
            </span>
          </div>
        </Link>

        {/* ─── 桌面端导航菜单（lg 及以上屏幕显示）────────────────────────────── */}
        <nav className="hidden lg:flex items-center flex-1 justify-center" style={{ gap: 2 }}>
          {navLinks.map((link) => {
            // 判断是否为当前页面：首页精确匹配，其他前缀匹配
            const active = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center rounded-md cursor-pointer whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'  // 当前页面高亮
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                style={{
                  padding: '5px 9px',
                  gap: 4,
                  fontSize: 13,
                  fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                }}
              >
                <link.icon size={13} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ─── 右侧功能区（md 及以上屏幕显示）─────────────────────────────────── */}
        <div className="hidden md:flex items-center shrink-0" style={{ gap: 'var(--spacing-sm)' }}>
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div
              className="flex items-center rounded-lg border border-border bg-secondary/60"
              style={{ padding: '5px 10px', gap: 6 }}
            >
              <Search size={13} className="text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索法律问题 / 法条 / 案例"
                className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                style={{ width: 170, fontSize: 12 }}
              />
            </div>
          </form>

          {/* 帮助按钮 */}
          <button
            className="flex items-center text-muted-foreground hover:text-foreground cursor-pointer rounded-md hover:bg-secondary"
            style={{ padding: '5px 8px', gap: 4, fontSize: 12 }}
            onClick={() => alert('帮助中心功能即将上线，感谢您的使用！')}
          >
            <HelpCircle size={14} />
            帮助
          </button>

          {/* 登录/注册按钮 */}
          <button
            className="flex items-center rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
            style={{ padding: '5px 12px', gap: 4, fontSize: 12, fontWeight: 500 }}
            onClick={() => setShowLogin(true)}
          >
            <User size={13} />
            登录/注册
          </button>
        </div>

        {/* ─── 移动端菜单按钮（lg 以下屏幕显示）─────────────────────────────── */}
        <button
          className="lg:hidden flex items-center justify-center rounded-md text-foreground hover:bg-secondary cursor-pointer"
          style={{ width: 36, height: 36 }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 【技术支持条】（md 及以上屏幕显示） */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex justify-end items-center border-t border-border/50"
        style={{ padding: '3px var(--spacing-lg)', background: 'color-mix(in oklch, var(--primary) 4%, transparent)' }}
      >
        <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>
          基于 腾讯元器 · 得理 AI 技术支持
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 【移动端导航菜单】lg 以下屏幕显示，点击展开 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-border"
            style={{ padding: 'var(--spacing-sm)' }}
          >
            {/* 移动端搜索框 */}
            <form onSubmit={handleSearch} className="mb-2">
              <div
                className="flex items-center rounded-lg border border-border bg-secondary/60"
                style={{ padding: '8px 12px', gap: 8 }}
              >
                <Search size={15} className="text-muted-foreground" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索法律问题 / 法条 / 案例"
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  style={{ fontSize: 14 }}
                />
              </div>
            </form>
            {/* 导航链接网格（3列布局） */}
            <div className="grid grid-cols-3" style={{ gap: 4 }}>
              {navLinks.map((link) => {
                const active = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center rounded-md cursor-pointer ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                    style={{ padding: '8px 10px', gap: 6, fontSize: 13 }}
                  >
                    <link.icon size={15} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            {/* 底部技术支持信息和登录按钮 */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>基于腾讯元器 · 得理AI技术支持</span>
              <button
                className="flex items-center rounded-md border border-primary text-primary cursor-pointer"
                style={{ padding: '4px 10px', gap: 4, fontSize: 12 }}
                onClick={() => { setMobileOpen(false); setShowLogin(true); }}
              >
                <User size={12} />
                登录
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 【登录/注册模态框】点击登录按钮显示 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl border border-border bg-card"
              style={{ padding: 'var(--spacing-xl)', width: 360, maxWidth: '90vw' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 模态框标题和关闭按钮 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground" style={{ fontSize: 'var(--font-size-title)' }}>登录 / 注册</h3>
                <button onClick={() => setShowLogin(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              {/* 演示版说明卡片 */}
              <div
                className="rounded-xl text-center"
                style={{
                  padding: 'var(--spacing-lg)',
                  background: 'color-mix(in oklch, var(--theme-gold) 8%, transparent)',
                  border: '1px dashed var(--theme-gold)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
                <p className="font-semibold text-foreground" style={{ fontSize: 'var(--font-size-body)', marginBottom: 4 }}>
                  演示版 · 无需登录
                </p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-label)' }}>
                  本平台为第十七届中国大学生服务外包创新创业大赛 D06 参赛作品，所有功能均可直接体验，无需注册账号。
                </p>
              </div>
              {/* 直接体验按钮 */}
              <button
                className="w-full rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer hover:opacity-90 transition-opacity"
                style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-body)' }}
                onClick={() => setShowLogin(false)}
              >
                直接体验全部功能
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
