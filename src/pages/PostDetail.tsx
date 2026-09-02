import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from '../types/post';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface PostDetailProps {
  posts: Post[];
  onDeletePost: (id: number) => Promise<void>;
}

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 권한 없음 */
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 px-2 py-1 text-xs font-bold rounded bg-zinc-700/80 text-zinc-200 opacity-0 group-hover:opacity-100 hover:bg-zinc-600 transition-opacity cursor-pointer"
      >
        {copied ? '복사됨' : '복사'}
      </button>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
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

  const handleDelete = async () => {
    if (!window.confirm('정말 이 기록을 삭제하시겠습니까?')) return;
    await onDeletePost(post.id);
    navigate('/');
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
        className="mb-6 flex items-center gap-1 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        ← 목록으로
      </button>

      {/* 본문 아티클 영역 */}
      <article className="border-t border-zinc-800 pt-6">
        <span className={`text-sm font-bold ${getBadgeColor(post.type)}`}>
          {post.type}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 mt-2 mb-3 tracking-tight">
          {post.title}
        </h1>
        <p className="text-xs text-zinc-500 mb-3">작성일: {post.date}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {post.tags.map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/?tag=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* 본문 상자 */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-6 rounded-xl min-h-[250px] shadow-lg prose prose-invert max-w-none prose-pre:whitespace-pre-wrap">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{ pre: CodeBlock }}
          >
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
