import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
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

// Hàm bỏ dấu Tiếng Việt ở Backend
function removeVietnameseTones(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', adminRoutes);

// =========================================================
// API TÌM KIẾM TRỰC TIẾP TRONG DATABASE MONGODB (REAL SERVER SEARCH)
// =========================================================
app.get('/api/search', async (req, res) => {
    try {
        const rawQuery = (req.query.q || '').trim();
        if (!rawQuery) {
            return res.json({ success: true, results: [] });
        }

        const cleanQuery = removeVietnameseTones(rawQuery);
        let allResults = [];

        // Truy vấn trực tiếp vào các collections trong MongoDB
        const db = mongoose.connection.db;

        if (db) {
            // 1. Quét bảng Events
            const events = await db.collection('events').find({}).toArray().catch(() => []);
            events.forEach(item => {
                const title = item.title || item.name || item.title_vi || item.heading || '';
                const summary = item.summary || item.description || item.content || '';
                if (removeVietnameseTones(title).includes(cleanQuery) || removeVietnameseTones(summary).includes(cleanQuery)) {
                    allResults.push({
                        title,
                        category: 'SỰ KIỆN',
                        url: `/events#${item._id}`,
                        summary
                    });
                }
            });

            // 2. Quét bảng Courses
            const courses = await db.collection('courses').find({}).toArray().catch(() => []);
            courses.forEach(item => {
                const title = item.title || item.name || item.title_vi || '';
                const summary = item.summary || item.description || item.content || '';
                if (removeVietnameseTones(title).includes(cleanQuery) || removeVietnameseTones(summary).includes(cleanQuery)) {
                    allResults.push({
                        title,
                        category: 'ĐÀO TẠO QUỐC TẾ',
                        url: `/international-training#${item._id}`,
                        summary
                    });
                }
            });

            // 3. Quét bảng Travels
            const travels = await db.collection('travels').find({}).toArray().catch(() => []);
            travels.forEach(item => {
                const title = item.title || item.name || item.title_vi || '';
                const summary = item.summary || item.description || item.content || '';
                if (removeVietnameseTones(title).includes(cleanQuery) || removeVietnameseTones(summary).includes(cleanQuery)) {
                    allResults.push({
                        title,
                        category: 'DU LỊCH',
                        url: `/italy-travel#${item._id}`,
                        summary
                    });
                }
            });
        }

        // 4. Các trang tĩnh chính
        const staticPages = [
            { title: "Giới thiệu VietItalia Bridge", category: "GIỚI THIỆU", url: "/about", summary: "Tổ chức cầu nối văn hóa, giáo dục và kinh doanh song phương Việt Nam - Italia." },
            { title: "Chương trình Đại sứ Văn hóa VietItalia 2026", category: "ĐẠI SỨ", url: "/ambassador", summary: "Kết nối thế hệ trẻ, tôn vinh mối quan hệ ngoại giao Việt Nam - Ý." },
            { title: "Chương trình Đào tạo Quốc tế & Học bổng Du học Ý", category: "ĐÀO TẠO QUỐC TẾ", url: "/international-training", summary: "Tuyển sinh và học bổng du học tại các trường đại học danh tiếng ở Ý." },
            { title: "Thị trường nước Ý & Cơ hội Giao thương Doanh nghiệp", category: "THỊ TRƯỜNG Ý", url: "/italy-market", summary: "Tổng quan kinh tế, xuất nhập khẩu và cơ hội đầu tư kinh doanh Việt - Ý." },
            { title: "Du lịch Ý & Trải nghiệm Văn hóa", category: "DU LỊCH", url: "/italy-travel", summary: "Khám phá các di sản văn hóa, ẩm thực, địa điểm du lịch nổi tiếng tại Ý." },
            { title: "Liên hệ & Hợp tác VietItalia", category: "LIÊN HỆ", url: "/contact", summary: "Thông tin văn phòng liên hệ tại Feltre (BL) - Italia." }
        ];

        staticPages.forEach(item => {
            if (removeVietnameseTones(item.title).includes(cleanQuery) || removeVietnameseTones(item.summary).includes(cleanQuery)) {
                allResults.push(item);
            }
        });

        // Lọc loại bỏ trùng lặp
        const uniqueResults = [];
        const seen = new Set();
        allResults.forEach(item => {
            const key = removeVietnameseTones(item.title);
            if (key && !seen.has(key)) {
                seen.add(key);
                uniqueResults.push(item);
            }
        });

        res.json({ success: true, total: uniqueResults.length, results: uniqueResults });
    } catch (error) {
        console.error("Lỗi API Search:", error);
        res.status(500).json({ success: false, results: [] });
    }
});

// Health check API
app.get('/api/health', (req, res) => {
    res.json({ message: '🚀 Backend Vietitalia Admin đang hoạt động!' });
});

// Phục vụ giao diện Frontend tĩnh từ frontend/dist
const distPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Phục vụ Single Page Application
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