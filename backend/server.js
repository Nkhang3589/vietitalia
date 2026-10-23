import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import eventRoutes from './src/routes/eventRoutes.js';
import travelRoutes from './src/routes/travelRoutes.js';
import courseRoutes from './src/routes/courseRoute.js';
import adminRoutes from './src/routes/adminRoute.js';

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

// Phục vụ giao diện Frontend (dist)
const frontendDist = path.resolve(process.cwd(), 'frontend/dist');
const altFrontendDist = path.resolve(process.cwd(), '../frontend/dist');

const distPath = fs.existsSync(frontendDist) 
  ? frontendDist 
  : (fs.existsSync(altFrontendDist) ? altFrontendDist : null);

if (distPath) {
  app.use(express.static(distPath));
  
  // Trả về index.html cho mọi route giao diện (không phải API)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Xử lý route 404 cho API không tồn tại
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route không tồn tại!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang khởi chạy tại: http://localhost:${PORT}`);
});