import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
import { verifyPassword, generateToken } from '../lib/auth.js';

interface LoginBody {
  phone: string;
  password: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, password } = req.body as LoginBody;

    // 유효성 검사
    if (!phone || !password) {
      return res.status(400).json({ error: '전화번호와 비밀번호를 입력해주세요.' });
    }

    // 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname, phone, password_hash')
      .eq('phone', phone.replace(/-/g, ''))
      .single();

    if (error || !user) {
      return res.status(401).json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      nickname: user.nickname,
    });

    return res.status(200).json({
      message: '로그인 성공',
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
