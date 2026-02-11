import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
import { getUserFromRequest } from '../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 토큰에서 사용자 정보 추출
  const tokenUser = getUserFromRequest(req);
  if (!tokenUser) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    // GET: 찜 목록 조회
    if (req.method === 'GET') {
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
    }

    // POST: 찜하기 추가 (body에서 festivalId 가져옴)
    if (req.method === 'POST') {
      const { festivalId } = req.body || {};

      if (!festivalId || typeof festivalId !== 'string') {
        return res.status(400).json({ error: '축제 ID가 필요합니다.' });
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: tokenUser.userId,
          festival_id: festivalId,
        });

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: '이미 찜한 축제입니다.' });
        }
        console.error('Add favorite error:', error);
        return res.status(500).json({ error: '찜하기에 실패했습니다.' });
      }

      return res.status(201).json({
        message: '찜하기가 완료되었습니다.',
        festivalId,
      });
    }

    // DELETE: 찜하기 취소 (query에서 festivalId 가져옴)
    if (req.method === 'DELETE') {
      const festivalId = req.query.festivalId as string;

      if (!festivalId) {
        return res.status(400).json({ error: '축제 ID가 필요합니다.' });
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', tokenUser.userId)
        .eq('festival_id', festivalId);

      if (error) {
        console.error('Remove favorite error:', error);
        return res.status(500).json({ error: '찜하기 취소에 실패했습니다.' });
      }

      return res.status(200).json({
        message: '찜하기가 취소되었습니다.',
        festivalId,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Favorite error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
