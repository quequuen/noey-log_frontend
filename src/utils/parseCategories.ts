// 본문 맨 위/맨 아래 줄에 적힌 #해시태그를 카테고리로 추출하는 유틸

const HASHTAG_PATTERN = /#([^\s#]+)/g;

export function extractCategoriesFromContent(rawContent: string): {
  categories: string[];
  content: string;
} {
  const lines = rawContent.split('\n');
  const nonEmptyIdxs = lines.reduce<number[]>((acc, line, i) => {
    if (line.trim() !== '') acc.push(i);
    return acc;
  }, []);

  if (nonEmptyIdxs.length === 0) {
    return { categories: [], content: rawContent };
  }

  const firstIdx = nonEmptyIdxs[0];
  const lastIdx = nonEmptyIdxs[nonEmptyIdxs.length - 1];
  const targetIdxs = new Set([firstIdx, lastIdx]);
  const categories = new Set<string>();

  targetIdxs.forEach(idx => {
    lines[idx] = lines[idx]
      .replace(HASHTAG_PATTERN, (_match, tag: string) => {
        categories.add(tag);
        return '';
      })
      .replace(/\s+/g, ' ')
      .trim();
  });

  // 해시태그만 있던 줄이 비면 앞뒤 빈 줄로 접어서 제거한다.
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === '') start++;
  while (end > start && lines[end - 1].trim() === '') end--;

  return { categories: [...categories], content: lines.slice(start, end).join('\n') };
}
