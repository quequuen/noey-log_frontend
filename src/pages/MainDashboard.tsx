import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Post, PostType } from '../types/post';

interface MainDashboardProps {
  posts: Post[];
  loading: boolean;
}

const TABS = ['전체', '회고', '이슈 목록', 'WIL'] as const;
type Tab = (typeof TABS)[number];

function getAllTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap(p => p.tags))].sort((a, b) =>
    a.localeCompare(b, 'ko')
  );
}

export default function MainDashboard({ posts, loading }: MainDashboardProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: Tab =
    (TABS.find(t => t === searchParams.get('type')) as Tab) ?? '전체';
  const selectedTags = searchParams.getAll('tag');
  const urlQuery = searchParams.get('q') ?? '';

  // 검색 입력은 로컬 state로 관리하고 URL 반영은 디바운스한다.
  const [query, setQuery] = useState(urlQuery);

  // 뒤로가기 등 외부에서 q가 바뀌면 렌더 중에 입력창을 맞춰준다.
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setQuery(urlQuery);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      setSearchParams(
        prev => {
          if ((prev.get('q') ?? '') === query) return prev;
          const next = new URLSearchParams(prev);
          if (query) next.set('q', query);
          else next.delete('q');
          return next;
        },
        { replace: true }
      );
    }, 250);
    return () => clearTimeout(id);
  }, [query, setSearchParams]);

  const allTags = useMemo(() => getAllTags(posts), [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts.filter(post => {
      if (activeTab !== '전체' && post.type !== activeTab) return false;

      if (selectedTags.length > 0 && !selectedTags.every(t => post.tags.includes(t))) {
        return false;
      }

      if (q) {
        const haystack = [post.title, post.content, ...post.tags]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [posts, activeTab, selectedTags, query]);

  const getPostStyles = (type: PostType) => {
    if (type === '회고') {
      return { text: 'text-sky-400', hoverBorder: 'hover:border-sky-400' };
    }
    if (type === '이슈 목록') {
      return { text: 'text-rose-400', hoverBorder: 'hover:border-rose-400' };
    }
    return { text: 'text-emerald-400', hoverBorder: 'hover:border-emerald-400' };
  };

  const setParams = (mutate: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };

  const handleTabChange = (tab: Tab) => {
    setParams(params => {
      if (tab === '전체') params.delete('type');
      else params.set('type', tab);
    });
  };

  const toggleTag = (tag: string) => {
    setParams(params => {
      const current = params.getAll('tag');
      params.delete('tag');
      if (current.includes(tag)) {
        current.filter(t => t !== tag).forEach(t => params.append('tag', t));
      } else {
        [...current, tag].forEach(t => params.append('tag', t));
      }
    });
  };

  const clearFilters = () => {
    setQuery('');
    setParams(params => {
      params.delete('tag');
      params.delete('q');
    });
  };

  const hasActiveFilters = selectedTags.length > 0 || query.trim() !== '';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors duration-200 cursor-pointer
                ${activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {import.meta.env.DEV && (
          <button
            className="px-4 py-1.5 text-sm font-bold bg-emerald-950/50 text-yellow-400 border border-yellow-900/60 rounded-md hover:bg-yellow-900/40 hover:text-yellow-300 hover:border-yellow-500 transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/write')}
          >
            작성
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && setQuery('')}
          placeholder="제목 · 내용 · 태그 검색"
          className="w-full px-4 py-2 pr-9 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="검색어 지우기"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {allTags.map(tag => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 cursor-pointer
                  ${active
                    ? 'bg-zinc-200 text-black'
                    : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
                  }`}
              >
                #{tag}
              </button>
            );
          })}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-xs font-bold text-zinc-500 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
            >
              초기화 ✕
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-center text-zinc-500 py-10 w-full">불러오는 중...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-zinc-500 py-10 w-full">표시할 글이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {filteredPosts.map(post => {
            const { text, hoverBorder } = getPostStyles(post.type);

            return (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className={`w-full p-5 bg-zinc-900 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-900/80 transition-all duration-200 shadow-sm ${hoverBorder}`}
              >
                <span className={`text-xs font-bold block mb-1.5 ${text}`}>
                  {post.type}
                </span>

                <h2 className="text-lg font-bold text-zinc-100 mb-2">
                  {post.title}
                </h2>

                <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        onClick={e => {
                          e.stopPropagation();
                          toggleTag(tag);
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {post.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
