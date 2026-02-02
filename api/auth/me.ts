import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';
import { getUserFromRequest } from '../lib/auth';

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

    // DB에서 최신 사용자 정보 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname, phone, created_at')
      .eq('id', tokenUser.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
