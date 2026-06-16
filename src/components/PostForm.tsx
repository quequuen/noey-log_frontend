// 글 입력 폼 컴포넌트

import React, { useState } from 'react';
import type { NewPostInput, PostType } from '../types/post';

interface PostFormProps {
  onAddPost: (newPost: NewPostInput) => void;
}

export default function PostForm({ onAddPost }: PostFormProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<PostType>('회고'); // 기본값 설정

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 모두 입력해 주세요!');
    
    onAddPost({ title, content, type });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ margin: '0 0 10px 0' }}>📝 새로운 기록 추가</h3>
      <div style={inputGroupStyle}>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as PostType)} 
          style={selectStyle}
        >
          <option value="회고">회고</option>
          <option value="이슈 목록">이슈 목록</option>
          <option value="WIL">WIL</option>
        </select>
        <input 
          type="text" 
          placeholder="제목을 입력하세요" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
      </div>
      <textarea 
        placeholder="내용을 입력하세요..." 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        style={textareaStyle}
      />
      <button type="submit" style={buttonStyle}>기록하기</button>
    </form>
  );
}

// 스타일 뼈대
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#f9f9f9' };
const inputGroupStyle: React.CSSProperties = { display: 'flex', gap: '10px' };
const selectStyle: React.CSSProperties = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' };
const inputStyle: React.CSSProperties = { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const textareaStyle: React.CSSProperties = { minHeight: '120px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' };
const buttonStyle: React.CSSProperties = { padding: '10px', backgroundColor: '#24292e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };