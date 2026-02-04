import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
import { getUserFromRequest } from '../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 토큰에서 사용자 정보 추출
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    // 찜 목록 조회
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('id, festival_id, created_at')
      .eq('user_id', tokenUser.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get favorites error:', error);
      return res.status(500).json({ error: '찜 목록을 불러오는데 실패했습니다.' });
    }

    return res.status(200).json({
      favorites: favorites.map((f) => ({
        id: f.id,
        festivalId: f.festival_id,
        createdAt: f.created_at,
      })),
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
