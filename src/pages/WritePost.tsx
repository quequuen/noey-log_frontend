import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NewPostInput, Post, PostType } from '../types/post';
import { MdEditor } from 'md-editor-rt';
import { useImageUpload } from '../hooks/useImageUpload';
import 'md-editor-rt/lib/style.css';

interface WritePostProps {
  posts: Post[];
  onAddPost: (newPost: NewPostInput) => void;
}

export default function WritePost({ posts, onAddPost }: WritePostProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<PostType>('회고');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  const { handleImageUpload, isUploading } = useImageUpload();

  const existingTags = useMemo(
    () => [...new Set(posts.flatMap(p => p.tags))].sort((a, b) => a.localeCompare(b, 'ko')),
    [posts]
  );

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/^#/, '');
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 모두 채워주세요!');

    const pending = tagInput.trim().replace(/^#/, '');
    const finalTags = pending && !tags.includes(pending) ? [...tags, pending] : tags;

    onAddPost({ title, content, type, tags: finalTags });
    navigate('/');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 text-zinc-100 relative rounded-md">

      {/* 업로드 중일 때 화면에 로딩 표시 띄우기 */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-md">
          <p className="text-emerald-400 font-bold text-lg animate-pulse">이미지 업로드 중...</p>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer mb-5"
        title="뒤로 가기"
      >
        <svg xmlns="http://www.w3.org/2000/center" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* 메타데이터 영역 */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PostType)}
            className="bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-md font-bold text-sm"
          >
            <option value="회고">회고</option>
            <option value="이슈 목록">이슈 목록</option>
            <option value="WIL">WIL</option>
          </select>
          <input type="text" placeholder="제목을 입력하세요..." value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-md text-lg font-bold outline-none focus:border-emerald-500" />
          <button onClick={handleSubmit} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-md transition-colors cursor-pointer">
            출간하기
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-md">
          <label htmlFor="tags" className="text-sm font-bold text-zinc-400 shrink-0">
            태그
          </label>
          {tags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-zinc-700 text-zinc-200"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
          <input
            id="tags"
            type="text"
            list="tag-suggestions"
            placeholder="입력 후 Enter (예: react)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => addTag(tagInput)}
            className="flex-1 min-w-[140px] bg-transparent text-sm outline-none"
          />
          <datalist id="tag-suggestions">
            {existingTags.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
      </div>

      {/* 마크다운 에디터 */}
      <div className="border border-zinc-800 rounded-md overflow-hidden">
        <MdEditor
          modelValue={content}
          onChange={setContent}
          onUploadImg={handleImageUpload}
          language="en-US"
          placeholder="마크다운 문법으로 이야기를 펼쳐보세요..."
          className="h-[60vh]"
          autoFocus={true}
        />
      </div>
    </div>
  );
}
