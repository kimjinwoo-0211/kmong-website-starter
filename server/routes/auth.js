import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const router = Router();


router.post('/login', async (req, res) => {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user._id, role: user.role, username }, process.env.JWT_SECRET, { expiresIn: '7d' });


res.cookie('token', token, {
httpOnly: true,
sameSite: 'lax',
maxAge: 7 * 24 * 60 * 60 * 1000
});
res.json({ message: 'Logged in', username });
});


router.post('/logout', (req, res) => {
res.clearCookie('token');
res.json({ message: 'Logged out' });
});


router.get('/me', (req, res) => {
// 클라이언트가 쿠키만으로 세션 상태 체크 필요 시 토큰 파싱 시도
try {
const token = req.cookies?.token;
if (!token) return res.status(200).json({ authenticated: false });
const decoded = jwt.verify(token, process.env.JWT_SECRET);
return res.json({ authenticated: true, user: { username: decoded.username, role: decoded.role } });
} catch {
return res.status(200).json({ authenticated: false });
}
});


export default router;