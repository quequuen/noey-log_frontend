// api 연결용 훅

import { useState, useEffect } from 'react';
import type { Post, NewPostInput } from '../types/post';

// 초기 더미 데이터 (테스트용)
const initialData: Post[] = [
  { id: 1, type: '회고', title: '6월 2주차 주간 회고', content: '이번 주는 C++ 메모리 구조와 포인터 개념을 다시 정리했다. 다음 주에는 백엔드 CRUD를 붙여봐야지.', date: '2026-06-12' },
  { id: 2, type: '이슈 목록', title: 'Git Clone 후 환경 변수 미설정 에러', content: '기기를 바꾸고 레포지토리를 새로 클론받았는데 빌드 에러가 남. 로컬 .env 파일이 누락되어 발생한 문제였음.', date: '2026-06-14' },
  { id: 3, type: 'WIL', title: 'MySQL Index와 B-Tree 구조', content: '데이터가 많아질 때 조회 성능을 올리기 위해 인덱스가 왜 필요한지, 그리고 왜 B-Tree 구조를 사용하는지 정리함.', date: '2026-06-16' },
];

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async (): Promise<void> => {
    setLoading(true);
    try {
      // TODO: const res = await axios.get<Post[]>('/api/posts'); setPosts(res.data);
      setPosts(initialData); 
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (newPost: NewPostInput): Promise<void> => {
    try {
      const createdPost: Post = {
        id: Date.now(),
        ...newPost,
        date: new Date().toISOString().split('T')[0]
      };
      setPosts((prev) => [createdPost, ...prev]);
    } catch (error) {
      console.error("글 저장 실패:", error);
    }
  };

  const deletePost = async (id: number): Promise<void> => {
    try {
      setPosts((prev) => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error("글 삭제 실패:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  return { posts, loading, addPost, deletePost };
};