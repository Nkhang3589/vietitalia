import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import eventRoutes from './src/routes/eventRoutes.js';
import travelRoutes from './src/routes/travelRoutes.js';
import courseRoutes from './src/routes/courseRoute.js';
import adminRoutes from './src/routes/adminRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', adminRoutes);

// Health check API
app.get('/api/health', (req, res) => {
    res.json({ message: '🚀 Backend Vietitalia Admin đang hoạt động!' });
});

// Phục vụ giao diện Frontend tĩnh từ frontend/dist
const distPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Phục vụ Single Page Application cho các request GET (tránh dùng app.get('*') bị lỗi path-to-regexp)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(distPath, 'index.html'), (err) => {
            if (err) next();
        });
    }
    next();
});

// Xử lý route 404 cho API không tồn tại
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route không tồn tại!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang khởi chạy tại port: ${PORT}`);
});