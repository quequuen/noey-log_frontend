import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, PostType } from '../types/post';

interface MainDashboardProps {
  posts: Post[];
  loading: boolean;
}

const TYPES_WITH_SUBCATEGORY: PostType[] = ['이슈 목록', 'WIL'];

function getSubcategories(posts: Post[], type: PostType): string[] {
  return [...new Set(
    posts
      .filter(p => p.type === type && p.subcategory)
      .map(p => p.subcategory!)
  )].sort();
}

export default function MainDashboard({ posts, loading }: MainDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'전체' | PostType>('전체');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('전체');

  const subcategories = useMemo(
    () => (TYPES_WITH_SUBCATEGORY.includes(activeTab as PostType)
      ? getSubcategories(posts, activeTab as PostType)
      : []),
    [posts, activeTab]
  );

  const hasUncategorized = useMemo(
    () => TYPES_WITH_SUBCATEGORY.includes(activeTab as PostType)
      && posts.some(p => p.type === activeTab && !p.subcategory),
    [posts, activeTab]
  );

  const filteredPosts = useMemo(() => {
    let result = activeTab === '전체' ? posts : posts.filter(p => p.type === activeTab);

    if (TYPES_WITH_SUBCATEGORY.includes(activeTab as PostType) && activeSubcategory !== '전체') {
      if (activeSubcategory === '미분류') {
        result = result.filter(p => !p.subcategory);
      } else {
        result = result.filter(p => p.subcategory === activeSubcategory);
      }
    }

    return result;
  }, [posts, activeTab, activeSubcategory]);

  const getPostStyles = (type: PostType) => {
    if (type === '회고') {
      return { text: 'text-sky-400', hoverBorder: 'hover:border-sky-400' };
    }
    if (type === '이슈 목록') {
      return { text: 'text-rose-400', hoverBorder: 'hover:border-rose-400' };
    }
    return { text: 'text-emerald-400', hoverBorder: 'hover:border-emerald-400' };
  };

  const handleTabChange = (tab: '전체' | PostType) => {
    setActiveTab(tab);
    setActiveSubcategory('전체');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {(['전체', '회고', '이슈 목록', 'WIL'] as const).map(tab => (
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

      {subcategories.length > 0 || hasUncategorized ? (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveSubcategory('전체')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 cursor-pointer
              ${activeSubcategory === '전체'
                ? 'bg-zinc-200 text-black'
                : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
              }`}
          >
            전체
          </button>
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubcategory(sub)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 cursor-pointer
                ${activeSubcategory === sub
                  ? 'bg-zinc-200 text-black'
                  : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
            >
              {sub}
            </button>
          ))}
          {hasUncategorized && (
            <button
              onClick={() => setActiveSubcategory('미분류')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 cursor-pointer
                ${activeSubcategory === '미분류'
                  ? 'bg-zinc-200 text-black'
                  : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
            >
              미분류
            </button>
          )}
        </div>
      ) : (
        <div className="mb-6" />
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
                  {post.subcategory ? `${post.type} > ${post.subcategory}` : post.type}
                </span>

                <h2 className="text-lg font-bold text-zinc-100 mb-2">
                  {post.title}
                </h2>

                <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.content}
                </p>

                <span className="text-xs text-zinc-500 block">
                  {post.date}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
