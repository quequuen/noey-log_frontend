import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePosts } from './hooks/usePosts';
import MainDashboard from './pages/MainDashboard';
import PostDetail from './pages/PostDetail';
import WritePost from './pages/WritePost';

export default function App() {
  // 전역 상태처럼 사용하기 위해 훅의 데이터와 함수들을 하위 페이지 컴포넌트로 전달합니다.
  const { posts, loading, addPost, deletePost } = usePosts();

  return (
    <Router>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
        <Routes>
          {/* 1. 메인 목록 페이지 */}
          <Route path="/" element={<MainDashboard posts={posts} loading={loading} />} />
          
          {/* 2. 글 쓰기 페이지 */}
          <Route path="/write" element={<WritePost onAddPost={addPost} />} />
          
          {/* 3. 글 상세 보기 페이지 (:id 가 주소창의 동적 파라미터가 됩니다) */}
          <Route path="/post/:id" element={<PostDetail posts={posts} onDeletePost={deletePost} />} />
        </Routes>
      </div>
    </Router>
  );
}