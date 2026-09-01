import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-24 text-zinc-400">
      <p className="text-6xl font-extrabold tracking-tight text-zinc-100 mb-3">404</p>
      <p className="text-lg font-bold text-zinc-300 mb-1">여긴 우주 밖이에요</p>
      <p className="text-sm text-zinc-500 mb-8">
        찾으시는 페이지가 없거나 주소가 바뀌었어요.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 text-sm font-bold bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        홈으로 가기
      </button>
    </div>
  );
}
