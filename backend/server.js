import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import eventRoutes from './src/routes/eventRoutes.js';
import travelRoutes from './src/routes/travelRoutes.js';
import courseRoutes from './src/routes/courseRoute.js';
import adminRoutes from './src/routes/adminRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true }));

app.use('/api/events', eventRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', adminRoutes);

// check
app.get('/', (req, res) => {
    res.json({ message: '🚀 Backend Vietitalia Admin đang hoạt động!' });
});

// Xử lý route 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route không tồn tại!' });
});
// Cấu hình phục vụ file giao diện Frontend (dist)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang khởi chạy tại: http://localhost:${PORT}`);
});