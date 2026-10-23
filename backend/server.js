import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import eventRoutes from './src/routes/eventRoutes.js';
import travelRoutes from './src/routes/travelRoutes.js';
import courseRoutes from './src/routes/courseRoute.js';
import adminRoutes from './src/routes/adminRoute.js';

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang khởi chạy tại: http://localhost:${PORT}`);
});