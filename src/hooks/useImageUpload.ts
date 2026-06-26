import { useState } from 'react';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (files: File[], callback: (urls: string[]) => void) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('http://localhost:8080/api/images/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`${file.name} 업로드 실패 (서버 에러)`);
          }

          const data = await response.json();
          return data.url;
        })
      );

      // 에디터 본문에 이미지 주소 삽입
      callback(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
            console.error('이미지 업로드 오류:', err.message);
            setUploadError(err.message);
            alert(err.message);
        } else {
            // 혹시라도 Error 객체가 아닌 엉뚱한 데이터(문자열 등)가 들어왔을 때의 예외 처리
            console.error('알 수 없는 오류 발생:', err);
            setUploadError('이미지 업로드 중 알 수 없는 오류가 발생했습니다.');
        }
    } finally {
    setIsUploading(false);
    }
    
    
  };

  // 컴포넌트에서 쓸 변수와 함수를 반환
  return { handleImageUpload, isUploading, uploadError };
}