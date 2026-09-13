// 타입 정의 파일

export interface Post {
  id: number;
  categories: string[];
  tags: string[];
  title: string;
  content: string;
  date: string;
}

// 새 글을 생성할 때 필요한 데이터 타입 (id와 date는 서버/훅에서 자동 생성하므로 제외)
export type NewPostInput = Omit<Post, 'id' | 'date'>;
