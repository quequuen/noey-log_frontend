import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from '../types/post';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostDetailProps {
  posts: Post[];
  onDeletePost: (id: number) => void;
}

export default function PostDetail({ posts, onDeletePost }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = posts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="text-center py-20 text-zinc-400">
        <h3 className="text-lg font-bold mb-4">글을 찾을 수 없습니다.</h3>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          목록으로 가기
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('정말 이 기록을 삭제하시겠습니까?')) {
      onDeletePost(post.id);
      navigate('/');
    }
  };

  // 카테고리별 텍스트 색상 매핑 (MainDashboard와 통일)
  const getBadgeColor = (type: string) => {
    if (type === '회고') return 'text-sky-400';
    if (type === '이슈 목록') return 'text-rose-400';
    return 'text-emerald-400';
  };

  return (
    <div className="w-full text-zinc-100">
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={() => navigate('/')} 
        className="mb-6 flex items-center gap-1 text-xl font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        ←
      </button>

      {/* 본문 아티클 영역 */}
      <article className="border-t border-zinc-800 pt-6">
        <span className={`text-sm font-bold ${getBadgeColor(post.type)}`}>
          {post.subcategory ? `${post.type} > ${post.subcategory}` : post.type}
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-100 mt-2 mb-3 tracking-tight">
          {post.title}
        </h1>
        <p className="text-xs text-zinc-500 mb-8">
          작성일: {post.date}
        </p>
        
        {/* 본문 상자 */}
        <div className="text-base leading-relaxed text-black white-space-pre-wrap bg-zinc-100 border border-zinc-800 p-6 rounded-xl font-mono min-h-[250px] shadow-lg prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content.replace(/\\n/g, '\n')}
            </ReactMarkdown>
        </div>
      </article>

      {/* 하단 제어 버튼 컴포넌트 */}
      {import.meta.env.DEV && (
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleDelete} 
            className="px-4 py-2 text-sm font-bold bg-rose-950/40 text-rose-400 border border-rose-900/60 rounded-md hover:bg-rose-900/50 hover:text-rose-300 transition-all duration-200 cursor-pointer"
          >
            기록 삭제하기
          </button>
        </div>
      )}
    </div>
  );
}