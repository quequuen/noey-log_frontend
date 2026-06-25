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
    <div className="w-full text-zinc-100">
      {/* 상단 헤더 영역 (뒤로가기 및 타이틀) */}
      <div className="flex justify-between items-center mb-6">
        <button 
          type="button"
          onClick={() => navigate('/')} 
          className="flex items-center gap-1 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          ← 목록으로 돌아가기
        </button>
        <span className="text-xs text-zinc-500 font-mono">New Record</span>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* 카테고리 선택 및 제목 입력 */}
        <div className="flex gap-3">
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as PostType)} 
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-bold rounded-lg focus:outline-none focus:border-zinc-700 cursor-pointer transition-colors"
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
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg placeholder-zinc-600 focus:outline-none focus:border-zinc-600 text-base transition-colors"
          />
        </div>

        {/* 장문의 글을 적는 부드러운 미색 본문 영역 */}
        <textarea 
          placeholder="오늘 마주한 에러 코드, 해결 과정, 배운 점들을 길게 자유롭게 기록해 보세요..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[350px] p-5 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-zinc-600 text-base leading-relaxed font-mono resize-vertical shadow-inner"
        />

        {/* 하단 버튼 그룹 (취소 / 출간하기) */}
        <div className="flex gap-3 justify-end mt-2">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="px-5 py-2.5 text-sm font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 text-sm font-bold bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors duration-200 cursor-pointer shadow-md"
          >
            출간하기
          </button>
        </div>
      </form>
    </div>
  );
}