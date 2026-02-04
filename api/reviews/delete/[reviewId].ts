import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase.js';
import { getUserFromRequest } from '../../lib/auth.js';

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

  const { reviewId } = req.query;

  if (!reviewId || typeof reviewId !== 'string') {
    return res.status(400).json({ error: '리뷰 ID가 필요합니다.' });
  }

  // 로그인 필수
  const tokenUser = getUserFromRequest(req);
  if (!tokenUser) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    // 리뷰 소유자 확인
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (fetchError || !review) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }

    if (review.user_id !== tokenUser.userId) {
      return res.status(403).json({ error: '본인의 리뷰만 삭제할 수 있습니다.' });
    }

    // 리뷰 삭제
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Delete review error:', error);
      return res.status(500).json({ error: '리뷰 삭제에 실패했습니다.' });
    }

    return res.status(200).json({
      message: '리뷰가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
