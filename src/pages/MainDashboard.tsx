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

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0 }}>💻 DevLog</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>회고 / 이슈 목록 / WIL 기록소</p>
        </div>
        {/* 글쓰기 페이지로 이동하는 버튼 */}
        <button onClick={() => navigate('/write')} style={writeBtnStyle}>✏️ 새 글 작성</button>
      </header>

      {/* 태그 필터 탭 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
        {(['전체', '회고', '이슈 목록', 'WIL'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px', border: 'none', borderRadius: '20px', cursor: 'pointer',
              backgroundColor: activeTab === tab ? '#24292e' : '#f1f3f5',
              color: activeTab === tab ? '#fff' : '#495057', fontWeight: 'bold'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 리스트 목록 */}
      {loading ? <p>불러오는 중...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPosts.map(post => (
            <div 
              key={post.id} 
              onClick={() => navigate(`/post/${post.id}`)} // 클릭 시 상세페이지 이동
              style={cardStyle}
            >
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0288d1', display: 'block', marginBottom: '6px' }}>{post.type}</span>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{post.title}</h2>
              {/* 본문 요약 (말줄임 처리) */}
              <p style={{ color: '#555', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.5' }}>
                {post.content}
              </p>
              <span style={{ fontSize: '12px', color: '#999' }}>{post.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const writeBtnStyle = { padding: '10px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle = { padding: '20px', border: '1px solid #e1e4e8', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' };