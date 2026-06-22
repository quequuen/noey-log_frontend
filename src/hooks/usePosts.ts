import { useState, useEffect } from 'react';
import type { Post, NewPostInput } from '../types/post';
import initialPosts from '../data/posts.json'; 

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(initialPosts as Post[]);
    setLoading(false);
  }, []);

  const handleAddPost = async (newPost: NewPostInput) => {
  try {
    const response = await fetch('http://localhost:8080/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      alert("글이 성공적으로 자동 저장되었습니다.");
      // 메인 화면 새로고침 등의 로직 처리
    }
  } catch (error) {
    console.error("스프링 부트 서버가 꺼져있는지 확인해보세요!", error);
  }
};

  return { posts, loading, onAddPost: handleAddPost };
}