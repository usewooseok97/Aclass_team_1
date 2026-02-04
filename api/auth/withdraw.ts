import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
import { getUserFromRequest } from '../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 토큰에서 사용자 정보 추출
    const tokenUser = getUserFromRequest(req);
    if (!tokenUser) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    // 사용자 삭제 (CASCADE로 favorites, reviews도 자동 삭제)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', tokenUser.userId);

    if (error) {
      console.error('Withdraw error:', error);
      return res.status(500).json({ error: '회원 탈퇴에 실패했습니다.' });
    }

    return res.status(200).json({
      message: '회원 탈퇴가 완료되었습니다.',
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
