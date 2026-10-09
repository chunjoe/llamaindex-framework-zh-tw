import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { contentPath, sitePath, rehypeSitePaths } from './site-path';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  ExternalLink,
  FileText,
  GitBranch,
  AtSign,
  MessageCircle,
  Menu,
  Monitor,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

const DOCS_ROOT = '/python/framework/';
const SOURCE_ROOT = 'https://developers.llamaindex.ai';
const LABELS = {
  getting_started: '開始使用',
  understanding: '學習',
  use_cases: '使用案例',
  module_guides: '元件指南',
  community: '開源社群',
  integrations: '整合',
  embeddings: 'Embedding 模型',
  llm: 'LLM',
  retrievers: 'Retriever',
  vector_stores: 'Vector Store',
};

function normalizeRoute(pathname) {
  let path = contentPath(decodeURI(pathname || DOCS_ROOT));
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
  if (!path.startsWith(DOCS_ROOT)) return DOCS_ROOT;
  return path.endsWith('/') ? path : `${path}/`;
}

function makeNavigation(pages, folderLabels = {}) {
  const root = { label: '文件', href: DOCS_ROOT, children: [], page: null, path: '' };
  const byPath = new Map([['', root]]);
  const ordered = [...pages].sort((a, b) => a.order - b.order);

  for (const page of ordered) {
    const relative = page.route.slice(DOCS_ROOT.length).replace(/\/$/, '');
    if (!relative) {
      root.page = page;
      continue;
    }
    const segments = relative.split('/');
    let parent = root;
    let prefix = '';
    segments.forEach((segment, index) => {
      prefix = prefix ? `${prefix}/${segment}` : segment;
      let item = byPath.get(prefix);
      if (!item) {
        item = {
          label: folderLabels[prefix] || LABELS[segment] || segment.replaceAll('_', ' '),
          href: null,
          children: [],
          page: null,
          order: page.order,
          path: prefix,
        };
        byPath.set(prefix, item);
        parent.children.push(item);
      }
      item.order = Math.min(item.order ?? page.order, page.order);
      if (index === segments.length - 1) {
        item.page = page;
        item.label = page.title || item.label;
        item.href = page.route;
      }
      parent = item;
    });
  }

  const sort = (node) => {
    node.children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    node.children.forEach(sort);
  };
  sort(root);
  return root;
}

function sourceUrlFor(page) {
  return page?.sourceUrl || `${SOURCE_ROOT}${page?.route || DOCS_ROOT}`;
}

function normalizeLink(href, page, knownRoutes) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|data:|javascript:)/i.test(href)) return href;
  const local = contentPath(href);
  if (local.startsWith('/') && !local.startsWith('//')) {
    const localRoute = local.split(/[?#]/)[0];
    if (knownRoutes.has(normalizeRoute(localRoute)) && localRoute.startsWith(DOCS_ROOT)) return sitePath(local);
    if (/^\/(assets\/|content\/|LICENSE\.LlamaIndex)/.test(local)) return sitePath(local);
  }
  try {
    const resolved = new URL(href, sourceUrlFor(page));
    if (resolved.hostname === 'developers.llamaindex.ai') {
      if (resolved.pathname.startsWith(DOCS_ROOT)) {
        let localPath = resolved.pathname.replace(/\/index\.md$/, '/').replace(/\.md$/, '/');
        if (!localPath.endsWith('/')) localPath += '/';
        if (knownRoutes.has(localPath)) return sitePath(`${localPath}${resolved.search}${resolved.hash}`);
        return `${SOURCE_ROOT}${localPath}${resolved.search}${resolved.hash}`;
      }
      return resolved.toString();
    }
    return resolved.toString();
  } catch {
    return href;
  }
}

function stripMarkdown(text = '') {
  return text
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bodyMarkdown(page) {
  const markdown = page.markdown || '';
  if (page.route !== DOCS_ROOT) return markdown;
  const lines = markdown.split('\n');
  if (!/^#\s+/.test(lines[0] || '')) return markdown;
  let index = 1;
  while (index < lines.length && !lines[index].trim()) index += 1;
  while (index < lines.length && lines[index].trim()) index += 1;
  while (index < lines.length && !lines[index].trim()) index += 1;
  if (lines[index]?.trim().startsWith('[') && lines[index].includes('](')) {
    while (index < lines.length && lines[index].trim()) index += 1;
  }
  return [lines[0], '', ...lines.slice(index)].join('\n');
}

function SidebarTree({ node, route, depth = 0, openGroups, onToggle, onNavigate }) {
  const hasChildren = node.children?.length > 0;
  const expanded = openGroups.has(node.path || node.label);
  const isActive = node.page?.route === route;
  const canNavigate = Boolean(node.href);

  if (!hasChildren && !canNavigate) return null;

  return (
    <div className={`nav-item depth-${Math.min(depth, 3)} ${isActive ? 'active' : ''}`}>
      <div className="nav-row">
        {canNavigate ? (
          <a href={sitePath(node.href)} onClick={onNavigate} aria-current={isActive ? 'page' : undefined}>
            {node.label}
          </a>
        ) : (
          <span className="nav-label">{node.label}</span>
        )}
        {hasChildren && (
          <button
            className="nav-expand"
            type="button"
            aria-label={`${expanded ? '收合' : '展開'}${node.label}`}
            aria-expanded={expanded}
            onClick={() => onToggle(node.path || node.label)}
          >
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="nav-children">
          {node.children.map((child) => (
            <SidebarTree
              key={child.path || child.href || child.label}
              node={child}
              route={route}
              depth={depth + 1}
              openGroups={openGroups}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchDialog({ open, onClose, pages }) {
  const [index, setIndex] = useState([]);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    fetch(sitePath('/content/search-index.json'))
      .then((response) => (response.ok ? response.json() : []))
      .then(setIndex)
      .catch(() => setIndex([]));
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return [];
    const terms = term.split(/\s+/).filter(Boolean);
    return index
      .map((item) => {
        const title = `${item.title} ${item.sourceTitle || ''}`.toLocaleLowerCase();
        const body = `${item.text || ''} ${item.sourceText || ''}`.toLocaleLowerCase();
        const score = terms.reduce((sum, token) => {
          return sum + (title.includes(token) ? 8 : 0) + (body.includes(token) ? 1 : 0);
        }, 0);
        return { ...item, score: terms.every((token) => title.includes(token) || body.includes(token)) ? score : 0 };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [index, query]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="搜尋文件">
        <div className="search-input-row">
          <Search size={19} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋繁中譯文或英文原文…"
            aria-label="搜尋文件"
          />
          <button type="button" className="icon-button" aria-label="關閉搜尋" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="search-results" aria-live="polite">
          {!query.trim() && <div className="search-empty">輸入主題、類別或 API 名稱開始搜尋。</div>}
          {query.trim() && results.length === 0 && <div className="search-empty">找不到符合「{query}」的文件。</div>}
          {results.map((result) => (
            <a className="search-result" key={result.route} href={sitePath(result.route)} onClick={onClose}>
              <span className="result-title">{result.title}</span>
              <span className="result-path">{result.route.replace(DOCS_ROOT, '').replace(/\/$/, '') || '首頁'}</span>
              <span className="result-snippet">{result.snippet || result.sourceTitle}</span>
            </a>
          ))}
        </div>
        <div className="search-foot"><kbd>Esc</kbd><span>關閉搜尋</span><span className="search-foot-note">搜尋涵蓋繁中與英文內容</span></div>
      </section>
    </div>
  );
}

function MarkdownBody({ page, onCopyCode, knownRoutes }) {
  const headings = page.headings || [];
  const contentRef = useRef(null);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6') || [];
    const articleTitle = contentRef.current?.closest('.article')?.querySelector('.article-header h1');
    articleTitle?.removeAttribute('id');
    elements.forEach((element, index) => {
      if (!headings[index]) return;
      if (index === 0 && headings[index].level === 1 && articleTitle) {
        articleTitle.id = headings[index].id;
        element.removeAttribute('id');
      } else element.id = headings[index].id;
    });
  }, [headings, page.markdown]);

  return (
    <div className="markdown-content" ref={contentRef}>
      {!page.markdown.trim() && <p>這篇來源文件目前沒有正文。</p>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSitePaths, rehypeHighlight]}
        components={{
        a: ({ href, children, ...props }) => {
          const target = normalizeLink(href, page, knownRoutes);
          const external = /^https?:\/\//.test(target || '') && !target.startsWith(window.location.origin);
          return <a href={target} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...props}>{children}</a>;
        },
        img: ({ src, alt, ...props }) => <img src={sitePath(src)} alt={alt || ''} loading="lazy" {...props} />,
        pre: ({ children }) => {
          return (
            <div className="code-wrap">
              <pre>{children}</pre>
              <button type="button" className="code-copy" onClick={(event) => onCopyCode(event.currentTarget.parentElement.querySelector('code')?.textContent || '')} aria-label="複製程式碼"><Clipboard size={15} /></button>
            </div>
          );
        },
        }}
      >
        {bodyMarkdown(page)}
      </ReactMarkdown>
    </div>
  );
}

function App() {
  const [manifest, setManifest] = useState(null);
  const [page, setPage] = useState(null);
  const [route, setRoute] = useState(normalizeRoute(window.location.pathname));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copyMenuOpen, setCopyMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('llamaindex-theme') || 'dark');
  const [notice, setNotice] = useState('');
  const [openGroups, setOpenGroups] = useState(() => new Set());

  useEffect(() => {
    fetch(sitePath('/content/manifest.json'))
      .then((response) => {
        if (!response.ok) throw new Error('文件索引尚未建立');
        return response.json();
      })
      .then((value) => {
        setManifest(value);
        const topGroups = value.pages.map((item) => item.route.slice(DOCS_ROOT.length).split('/')[0]).filter(Boolean);
        setOpenGroups((previous) => new Set([...previous, ...topGroups]));
      })
      .catch(() => setManifest({ pages: [], navigation: [] }));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('llamaindex-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePop = () => setRoute(normalizeRoute(window.location.pathname));
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('popstate', handlePop);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (!manifest?.pages) return;
    const selected = manifest.pages.find((item) => normalizeRoute(item.route) === route) || manifest.pages[0];
    if (!selected) return;
    let active = true;
    setPage(null);
    fetch(sitePath(selected.contentUrl))
      .then((response) => {
        if (!response.ok) throw new Error('文件內容不存在');
        return response.json();
      })
      .then((data) => { if (active) setPage({ ...selected, ...data }); })
      .catch(() => { if (active) setPage({ ...selected, markdown: '# 尚無文件內容', headings: [] }); });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => { active = false; };
  }, [manifest, route]);

  useEffect(() => {
    const segments = route.slice(DOCS_ROOT.length).split('/').filter(Boolean);
    const ancestors = segments.slice(0, -1).map((_segment, index) => segments.slice(0, index + 1).join('/'));
    if (ancestors.length) {
      setOpenGroups((previous) => new Set([...previous, ...ancestors]));
    }
  }, [route]);

  useEffect(() => {
    if (page) document.title = `${page.title} · LlamaIndex 繁體中文文件`;
    if (!page || !window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [page]);

  const navigation = useMemo(() => {
    if (!manifest?.pages) return null;
    return manifest.navigation || makeNavigation(manifest.pages, manifest.folderLabels);
  }, [manifest]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const knownRoutes = useMemo(() => new Set(manifest?.pages?.map((item) => item.route) || []), [manifest]);
  const toggleGroup = (key) => setOpenGroups((previous) => {
    const next = new Set(previous);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const announce = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  };

  const navigate = (event) => {
    const anchor = event.target.closest('a');
    if (!anchor || !anchor.href || anchor.target === '_blank') return;
    const url = new URL(anchor.href);
    if (url.origin === window.location.origin && contentPath(url.pathname).startsWith(DOCS_ROOT)) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const samePage = normalizeRoute(url.pathname) === route;
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
      if (samePage && url.hash) {
        requestAnimationFrame(() => document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView());
        return;
      }
      setRoute(normalizeRoute(url.pathname));
      if (url.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView());
    }
  };

  const copyCode = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      announce('程式碼已複製');
    } catch {
      announce('無法存取剪貼簿');
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(page?.markdown || '');
      setCopyMenuOpen(false);
      announce('Markdown 已複製');
    } catch {
      announce('無法存取剪貼簿');
    }
  };

  const currentIndex = manifest?.pages?.findIndex((item) => item.route === page?.route) ?? -1;
  const previousPage = currentIndex > 0 ? manifest.pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 ? manifest?.pages?.[currentIndex + 1] : null;
  const toc = (page?.headings || []).filter((heading) => heading.level === 2 || heading.level === 3);
  const breadcrumb = (page?.route || DOCS_ROOT).replace(DOCS_ROOT, '').split('/').filter(Boolean);

  return (
    <div className="app-shell" onClick={navigate}>
      <header className="topbar">
        <div className="brand-group">
          <button type="button" className="mobile-menu icon-button" aria-label="開啟導覽" onClick={(event) => { event.stopPropagation(); setSidebarOpen(true); }}><Menu size={20} /></button>
          <a className="brand" href={sitePath(DOCS_ROOT)} aria-label="LlamaIndex 文件首頁">
            <img className="brand-logo light-logo" src={sitePath('/assets/llamaindex-dark.svg')} alt="LlamaIndex" />
            <img className="brand-logo dark-logo" src={sitePath('/assets/llamaindex-light.svg')} alt="LlamaIndex" />
          </a>
          <span className="product-chip">Framework <span className="language-chip">繁中</span></span>
        </div>
        <div className="topbar-actions">
          <button type="button" className="search-trigger" aria-label="搜尋文件" onClick={(event) => { event.stopPropagation(); setSearchOpen(true); }}>
            <Search size={17} /><span>搜尋文件</span><kbd>Ctrl K</kbd>
          </button>
          <div className="menu-holder">
            <button type="button" className="icon-button theme-trigger" aria-label="變更外觀" onClick={(event) => { event.stopPropagation(); setThemeMenuOpen((value) => !value); }}>
              {theme === 'light' ? <Sun size={18} /> : theme === 'auto' ? <Monitor size={18} /> : <Moon size={18} />}
              <ChevronDown size={13} />
            </button>
            {themeMenuOpen && <div className="dropdown theme-menu" onClick={(event) => event.stopPropagation()}>
              {[['dark', '深色'], ['light', '淺色'], ['auto', '跟隨系統']].map(([value, label]) => <button type="button" key={value} onClick={() => { setTheme(value); setThemeMenuOpen(false); }}>{value === theme && <Check size={14} />}{label}</button>)}
            </div>}
          </div>
          <a className="github-link" href="https://github.com/run-llama/llama_index" target="_blank" rel="noreferrer"><GitBranch size={17} /><span>GitHub</span></a>
        </div>
      </header>

      <div className="layout">
        <div className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="文件導覽">
          <div className="sidebar-top">
            <div className="sidebar-tabs"><button type="button" className="selected">Framework</button><a href="https://developers.llamaindex.ai/python/llamaagents/workflows/">LlamaAgents</a></div>
          </div>
          {navigation ? (
            <nav className="nav-tree">
              {navigation.children.map((node) => <SidebarTree key={node.path || node.href || node.label} node={node} route={route} openGroups={openGroups} onToggle={toggleGroup} onNavigate={() => setSidebarOpen(false)} />)}
            </nav>
          ) : <div className="loading-nav">載入文件導覽…</div>}
          <div className="sidebar-bottom">
            <a className="ai-agents-link" href="https://developers.llamaindex.ai/for-agents/"><Sparkles size={15} /> 給 AI Agents <ChevronDown size={13} /></a>
            <div className="social-links"><a href="https://github.com/run-llama/llama_index" aria-label="GitHub"><GitBranch size={17} /></a><a href="https://discord.com/invite/eN6D2HQ4aX" aria-label="Discord"><MessageCircle size={17} /></a><a href="https://x.com/llama_index" aria-label="X"><AtSign size={16} /></a></div>
          </div>
        </aside>

        <main className="main-area">
          <div className="main-topline">
            <div className="breadcrumbs">
              <a href={sitePath(DOCS_ROOT)}>Framework</a><ChevronRight size={14} />
              {breadcrumb.length === 0 ? <span>總覽</span> : breadcrumb.map((part, index) => {
                const folderPath = breadcrumb.slice(0, index + 1).join('/');
                const label = index === breadcrumb.length - 1
                  ? page?.title || part
                  : manifest?.folderLabels?.[folderPath] || LABELS[part] || part.replaceAll('_', ' ');
                return <span key={`${part}-${index}`}>{index ? <ChevronRight size={14} /> : null}{label}</span>;
              })}
            </div>
            <div className="menu-holder markdown-menu-holder">
              <button type="button" className="markdown-trigger" aria-label="複製 Markdown" aria-expanded={copyMenuOpen} onClick={(event) => { event.stopPropagation(); setCopyMenuOpen((value) => !value); }}><Clipboard size={16} /><span>複製 Markdown</span><ChevronDown size={15} /></button>
              {copyMenuOpen && <div className="dropdown markdown-menu" onClick={(event) => event.stopPropagation()}>
                <button type="button" onClick={copyMarkdown}><Clipboard size={15} />複製 Markdown</button>
                <a href={page?.sourceUrl ? `${page.sourceUrl.replace(/\/$/, '')}/index.md` : '#'} target="_blank" rel="noreferrer"><FileText size={15} />檢視原始 Markdown<ExternalLink size={13} /></a>
              </div>}
            </div>
          </div>

          {!manifest && <div className="page-loading">正在載入本地文件…</div>}
          {manifest && !page && <div className="page-loading">正在開啟文件…</div>}
          {page && <div className="content-grid">
            <article className="article" data-route={page.route}>
              <header className="article-header">
                <h1>{page.route === DOCS_ROOT ? 'LlamaIndex Framework' : page.title}</h1>
                {page.description && <p className="article-description">{page.description}</p>}
                {page.route === DOCS_ROOT && <div className="hero-links"><a className="primary-link" href={sitePath(`${DOCS_ROOT}getting_started/starter_example/`)}>開始教學</a><a href={sitePath(`${DOCS_ROOT}getting_started/installation/`)}>安裝設定</a><a className="text-link" href="https://github.com/run-llama/llama_index" target="_blank" rel="noreferrer"><GitBranch size={16} />GitHub</a></div>}
              </header>
              <MarkdownBody page={page} onCopyCode={copyCode} knownRoutes={knownRoutes} />
              <div className="source-credit"><span>原始文件：</span><a href={page.sourceUrl} target="_blank" rel="noreferrer">LlamaIndex Framework</a><span> · MIT License</span></div>
              <nav className="page-pagination" aria-label="文件頁面導覽">
                {previousPage ? <a href={sitePath(previousPage.route)}><span>上一頁</span><strong>← {previousPage.title}</strong></a> : <span />}
                {nextPage ? <a href={sitePath(nextPage.route)} className="next"><span>下一頁</span><strong>{nextPage.title} →</strong></a> : <span />}
              </nav>
              <footer className="site-footer"><span>繁體中文翻譯副本</span><a href={sitePath('/LICENSE.LlamaIndex')} target="_blank" rel="noreferrer">MIT 授權</a></footer>
            </article>
            {toc.length > 1 && <aside className="toc" aria-label="本頁目錄"><strong>本頁目錄</strong>{toc.map((heading) => <a key={heading.id} className={`toc-level-${heading.level}`} href={`#${heading.id}`}>{heading.text}</a>)}</aside>}
          </div>}
        </main>
      </div>

      <SearchDialog open={searchOpen} onClose={closeSearch} pages={manifest?.pages || []} />
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default App;
