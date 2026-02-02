/**
 * 칠판 댓글 데이터 구조
 */
export interface ChalkboardComment {
  /** 고유 ID */
  id: string;
  /** 댓글 내용 (최대 10자) */
  text: string;
  /** 별점 (1~5) */
  rating: number;
  /** X 좌표 (퍼센트 단위, 0~100) */
  x: number;
  /** Y 좌표 (퍼센트 단위, 0~100) */
  y: number;
  /** 폰트 크기 (rem 단위, 1.5~3) */
  fontSize: number;
  /** 회전 각도 (도, -15~15) */
  rotate: number;
  /** 분필 색상 (hex 코드) */
  color: string;
  /** 생성 시간 (ISO 8601 문자열) */
  createdAt: string;
}

/**
 * 댓글 입력 폼 데이터
 */
export interface ChalkboardFormData {
  text: string;
  rating: number;
}

/**
 * 분필 색상 팔레트
 */
export const CHALK_COLORS = [
  '#ffffff', // 흰색
  '#ffb3ba', // 연분홍
  '#ffffba', // 연노랑
  '#bae1ff', // 연하늘색
  '#baffc9', // 연초록
  '#ffdfba', // 연주황
] as const;

export type ChalkColor = (typeof CHALK_COLORS)[number];
