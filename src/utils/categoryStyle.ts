// 카테고리 이름 문자열을 일관된 색상 스타일에 매핑하는 유틸

export const UNCATEGORIZED_LABEL = '카테고리 없음';

const PALETTE = [
  { text: 'text-sky-400', hoverBorder: 'hover:border-sky-400' },
  { text: 'text-rose-400', hoverBorder: 'hover:border-rose-400' },
  { text: 'text-emerald-400', hoverBorder: 'hover:border-emerald-400' },
  { text: 'text-amber-400', hoverBorder: 'hover:border-amber-400' },
  { text: 'text-violet-400', hoverBorder: 'hover:border-violet-400' },
  { text: 'text-cyan-400', hoverBorder: 'hover:border-cyan-400' },
];

export function getCategoryStyle(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
