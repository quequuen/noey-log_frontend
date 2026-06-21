import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdminGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Vite 환경변수가 DEV(로컬)가 아니라면 실행
    if (!import.meta.env.DEV) {
      alert('관리자만 접근할 수 있는 페이지입니다.');
      navigate('/', { replace: true }); // replace: true를 주어 뒤로가기 히스토리에 /write를 남기지 않습니다.
    }
  }, [navigate]);

  // 로컬 개발 환경인지 여부를 반환 (컴포넌트 내부에서 조건부 렌더링에 쓸 수 있게)
  return import.meta.env.DEV;
}