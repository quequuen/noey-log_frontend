import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from '../types/post';

interface PostDetailProps {
  posts: Post[];
  onDeletePost: (id: number) => void;
}

export default function PostDetail({ posts, onDeletePost }: PostDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // URL 파라미터 ID와 일치하는 글 찾기
  const post = posts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>글을 찾을 수 없습니다.</h3>
        <button onClick={() => navigate('/')}>목록으로 가기</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('정말 이 기록을 삭제하시겠습니까?')) {
      onDeletePost(post.id);
      navigate('/'); // 삭제 후 홈으로 이동
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginBottom: '20px', fontSize: '15px' }}>
        ← 목록으로 돌아가기
      </button>

      <article style={{ borderTop: '2px solid #24292e', paddingTop: '20px' }}>
        <span style={{ color: '#666', fontSize: '14px', fontWeight: 'bold' }}>{post.type}</span>
        <h1 style={{ fontSize: '28px', margin: '8px 0 12px 0' }}>{post.title}</h1>
        <p style={{ color: '#999', fontSize: '13px', marginBottom: '30px' }}>작성일: {post.date}</p>
        
        {/* 가독성을 높인 본문 영역 */}
        <div style={{ 
          fontSize: '16px', lineHeight: '1.8', color: '#24292e', whiteSpace: 'pre-wrap', 
          backgroundColor: '#f6f8fa', padding: '25px', borderRadius: '8px', fontFamily: 'monospace', minHeight: '200px' 
        }}>
          {post.content}
        </div>
      </article>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleDelete} style={{ padding: '8px 14px', backgroundColor: '#cb2431', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          기록 삭제하기
        </button>
      </div>
    </div>
  );
}