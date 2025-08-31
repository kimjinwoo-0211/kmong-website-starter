import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import Content from '../models/Content.js';
import { authRequired } from '../middleware/auth.js';


const router = Router();


// Multer 설정 (로컬 업로드)
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, 'server/uploads'),
filename: (req, file, cb) => {
const ext = path.extname(file.originalname);
cb(null, `${uuidv4()}${ext}`);
}
});
const upload = multer({ storage });


// 공개 목록 (랜딩 페이지에서 사용)
router.get('/public', async (req, res) => {
const { type } = req.query; // 단일 타입 필터 optional
const query = { published: true };
if (type) query.type = type;
const items = await Content.find(query).sort({ createdAt: -1 });
res.json(items);
});


// 관리자 목록
router.get('/', authRequired, async (req, res) => {
const items = await Content.find().sort({ createdAt: -1 });
res.json(items);
});


router.post('/', authRequired, async (req, res) => {
const created = await Content.create(req.body);
res.status(201).json(created);
});


router.put('/:id', authRequired, async (req, res) => {
const updated = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updated);
});


router.delete('/:id', authRequired, async (req, res) => {
await Content.findByIdAndDelete(req.params.id);
res.status(204).end();
});


router.post('/upload', authRequired, upload.single('image'), (req, res) => {
const publicPath = `/uploads/${req.file.filename}`;
res.status(201).json({ path: publicPath });
});


export default router;