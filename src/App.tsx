import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePosts } from './hooks/usePosts';
import MainDashboard from './pages/MainDashboard';
import PostDetail from './pages/PostDetail';
import WritePost from './pages/WritePost';

export default function App() {
  const { posts, loading, onAddPost, onDeletePost } = usePosts();

  return (
    <Router>
      <div className="w-[60%] bg-black h-[80%]">
        <Routes>
          {/* 메인 목록 페이지 */}
          <Route path="/" element={<MainDashboard posts={posts} loading={loading} />} />
          
          {/* 글 쓰기 페이지 */}
          <Route path="/write" element={<WritePost onAddPost={onAddPost} />} />
          
          {/* 글 상세 보기 페이지 (:id 가 주소창의 동적 파라미터) */}
          <Route path="/post/:id" element={<PostDetail posts={posts} onDeletePost={onDeletePost} />} />
        </Routes>
      </div>
    </Router>
  );
}