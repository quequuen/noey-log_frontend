import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NewPostInput, PostType } from '../types/post';

interface WritePostProps {
  onAddPost: (newPost: NewPostInput) => void;
}

export default function WritePost({ onAddPost }: WritePostProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<PostType>('회고');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 모두 채워주세요!');

    onAddPost({ title, content, type });
    navigate('/'); // 저장 성공 시 메인 대시보드로 리다이렉트
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 뒤로가기 버튼 */}
        <button 
            onClick={() => navigate('/')} 
            className="mb-6 flex items-center gap-1 text-xl font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
            ←
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as PostType)} 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="회고">회고</option>
            <option value="이슈 목록">이슈 목록</option>
            <option value="WIL">WIL</option>
          </select>
          <input 
            type="text" 
            placeholder="기술 블로그 제목을 입력하세요" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
          />
        </div>

        <textarea 
          placeholder="오늘 마주한 에러 코드, 해결 과정, 배운 점들을 길게 자유롭게 기록해 보세요..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          style={{ minHeight: '350px', padding: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', lineHeight: '1.6', resize: 'vertical' }}
        />

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/')} style={{ padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            취소
          </button>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#24292e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            출간하기
          </button>
        </div>
      </form>
    </div>
  );
}