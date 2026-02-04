import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase.js';
import { hashPassword, generateToken } from '../lib/auth.js';

interface SignupBody {
  nickname: string;
  phone: string;
  password: string;
  passwordConfirm: string;
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
    const { nickname, phone, password, passwordConfirm } = req.body as SignupBody;

    // 유효성 검사
    if (!nickname || !phone || !password || !passwordConfirm) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    if (nickname.length < 2 || nickname.length > 20) {
      return res.status(400).json({ error: '닉네임은 2~20자로 입력해주세요.' });
    }

    // 전화번호 형식 검사 (숫자만, 10-11자리)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      return res.status(400).json({ error: '올바른 전화번호를 입력해주세요.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 전화번호 중복 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone.replace(/-/g, ''))
      .single();

    if (existingUser) {
      return res.status(409).json({ error: '이미 등록된 전화번호입니다.' });
    }

    // 비밀번호 해시화
    const passwordHash = await hashPassword(password);

    // 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        nickname,
        phone: phone.replace(/-/g, ''),
        password_hash: passwordHash,
      })
      .select('id, nickname, phone')
      .single();

    if (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: newUser.id,
      phone: newUser.phone,
      nickname: newUser.nickname,
    });

    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.id,
        nickname: newUser.nickname,
        phone: newUser.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
