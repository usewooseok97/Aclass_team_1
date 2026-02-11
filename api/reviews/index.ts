import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
import { getUserFromRequest } from '../lib/auth.js';

interface ReviewBody {
  festivalId: string;
  text: string;
  rating: number;
  x: number;
  y: number;
  fontSize: number;
  rotate: number;
  color: string;
  festivalEndDate: string; // YYYY-MM-DD
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: 리뷰 조회 (query에서 festivalId 가져옴)
    if (req.method === 'GET') {
      const festivalId = req.query.festivalId as string;

      if (!festivalId) {
        return res.status(400).json({ error: '축제 ID가 필요합니다.' });
      }

      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          id,
          text,
          rating,
          x,
          y,
          font_size,
          rotate,
          color,
          created_at,
          users!inner(nickname)
        `)
        .eq('festival_id', festivalId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get reviews error:', error);
        return res.status(500).json({ error: '리뷰를 불러오는데 실패했습니다.' });
      }

      return res.status(200).json({
        reviews: reviews.map((r: any) => ({
          id: r.id,
          text: r.text,
          rating: r.rating,
          x: r.x,
          y: r.y,
          fontSize: r.font_size,
          rotate: r.rotate,
          color: r.color,
          createdAt: r.created_at,
          userName: r.users?.nickname || '익명',
        })),
      });
    }

    // POST: 리뷰 작성 (body에서 festivalId 가져옴)
    if (req.method === 'POST') {
      const tokenUser = getUserFromRequest(req);
      if (!tokenUser) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      const { festivalId, text, rating, x, y, fontSize, rotate, color, festivalEndDate } = req.body as ReviewBody;

      if (!festivalId || typeof festivalId !== 'string') {
        return res.status(400).json({ error: '축제 ID가 필요합니다.' });
      }

      if (!text || text.length > 10) {
        return res.status(400).json({ error: '리뷰는 1~10자로 입력해주세요.' });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: '별점은 1~5 사이로 입력해주세요.' });
      }

      const { data: newReview, error } = await supabase
        .from('reviews')
        .insert({
          user_id: tokenUser.userId,
          festival_id: festivalId,
          festival_end_date: festivalEndDate,
          text,
          rating,
          x,
          y,
          font_size: fontSize,
          rotate,
          color,
        })
        .select('id')
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: '이미 이 축제에 리뷰를 작성하셨습니다.' });
        }
        console.error('Add review error:', error);
        return res.status(500).json({ error: '리뷰 작성에 실패했습니다.' });
      }

      return res.status(201).json({
        message: '리뷰가 등록되었습니다.',
        reviewId: newReview.id,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Review error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
