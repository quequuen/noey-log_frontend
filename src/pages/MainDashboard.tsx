import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, PostType } from '../types/post';

interface MainDashboardProps {
  posts: Post[];
  loading: boolean;
}

export default function MainDashboard({ posts, loading }: MainDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'전체' | PostType>('전체');

  const filteredPosts = activeTab === '전체' ? posts : posts.filter(p => p.type === activeTab);

  // 카테고리별 글자 색상 매핑
  const getBadgeColor = (type: PostType) => {
    if (type === '회고') return 'text-sky-400';
    if (type === '이슈 목록') return 'text-rose-400';
    return 'text-emerald-400'; // WIL
  };

  return (
    <div className="w-full">
      {/* 상단 탭 및 작성 버튼 바 */}
      <div className="flex justify-between items-center mb-6">
        {/* 태그 필터 탭 */}
        <div className="flex gap-2">
          {(['전체', '회고', '이슈 목록', 'WIL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
        
        {/* 글쓰기 페이지로 이동하는 버튼 */}
        <button 
          className="px-4 py-1.5 text-sm font-bold bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors duration-200 cursor-pointer" 
          onClick={() => navigate('/write')}
        >
          작성
        </button>
      </div>

      {/* 리스트 목록 */}
      {loading ? (
        <p className="text-center text-zinc-500 py-10">불러오는 중...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-zinc-500 py-10">등록된 기록이 없습니다.</p>
          ) : (
            filteredPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => navigate(`/post/${post.id}`)}
                className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 shadow-sm"
              >
                {/* 카테고리 배지 */}
                <span className={`text-xs font-bold block mb-1.5 ${getBadgeColor(post.type)}`}>
                  {post.type}
                </span>
                
                {/* 제목 */}
                <h2 className="text-lg font-bold text-zinc-100 mb-2">
                  {post.title}
                </h2>
                
                {/* 본문 요약 (말줄임 처리) */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.content}
                </p>
                
                {/* 날짜 */}
                <span className="text-xs text-zinc-500 block">
                  {post.date}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}