import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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

// API Routes sẵn có
app.use('/api/events', eventRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', adminRoutes);

// =======================================================
// API TÌM KIẾM TOÀN BỘ NỘI DUNG WEBSITE (FULL-SITE SEARCH)
// =======================================================
app.get('/api/search', (req, res) => {
    try {
        const query = (req.query.q || '').trim().toLowerCase();
        if (!query) {
            return res.json({ success: true, results: [] });
        }

        let allArticles = [];

        // 1. Quét tự động tất cả các file dữ liệu JSON trong dự án
        const possibleDataPaths = [
            path.resolve(__dirname, '../frontend/public/data/posts.json'),
            path.resolve(__dirname, '../frontend/dist/data/posts.json'),
            path.resolve(__dirname, './src/data/posts.json')
        ];

        for (const dataPath of possibleDataPaths) {
            if (fs.existsSync(dataPath)) {
                try {
                    const fileContent = fs.readFileSync(dataPath, 'utf8');
                    const parsed = JSON.parse(fileContent);
                    if (Array.isArray(parsed)) {
                        allArticles = allArticles.concat(parsed);
                    }
                } catch (e) {
                    console.warn('Không thể đọc file data:', dataPath);
                }
            }
        }

        // 2. Thêm danh sách các trang chính tĩnh của website vào danh mục quét
        const staticPages = [
            { title: "Giới thiệu VietItalia Bridge", category: "GIỚI THIỆU", url: "/about", summary: "Tổ chức cầu nối văn hóa, giáo dục và kinh doanh song phương Việt Nam - Italia.", content: "VietItalia bridge cau noi van hoa giao duc kinh doanh viet nam italia feltre belluno" },
            { title: "Chương trình Đại sứ Văn hóa VietItalia", category: "ĐẠI SỨ", url: "/ambassador", summary: "Kết nối thế hệ trẻ, tôn vinh mối quan hệ ngoại giao Việt Nam - Ý.", content: "dai su van hoa giao luu thanh nien viet nam italia 2026" },
            { title: "Đào tạo Quốc tế & Học bổng Du học Ý", category: "ĐÀO TẠO QUỐC TẾ", url: "/international-training", summary: "Tuyển sinh và học bổng các trường đại học hàng đầu tại Ý.", content: "hoc bong du hoc y dai hoc politecnico di milano bologna tor vergata" },
            { title: "Thị trường nước Ý & Giao thương Doanh nghiệp", category: "THỊ TRƯỜNG Ý", url: "/italy-market", summary: "Cơ hội xuất nhập khẩu và đầu tư kinh doanh Việt - Ý.", content: "thi truong nuoc y xuat nhap khau thuong mai doanh nghiep viet nam italia" },
            { title: "Thị trường Việt Nam cho Doanh nghiệp Ý", category: "THỊ TRƯỜNG VIỆT NAM", url: "/vietnam-market", summary: "Môi trường đầu tư và kết nối đối tác tại Việt Nam.", content: "dau tu viet nam doanh nghiep y mo rong thi truong" },
            { title: "Business Matching - Kết nối Giao thương", category: "KẾT NỐI KINH DOANH", url: "/business-matching", summary: "Dịch vụ cầu nối trực tiếp đối tác Việt Nam và Ý.", content: "business matching ket noi giao thuong doi tac viet nam italia" },
            { title: "Du lịch Ý & Trải nghiệm Văn hóa", category: "DU LỊCH Ý", url: "/italy-travel", summary: "Khám phá di sản, văn hóa và địa điểm du lịch Ý.", content: "du lich y am thuc di san rome milan venice florence" },
            { title: "Liên hệ & Hợp tác", category: "LIÊN HỆ", url: "/contact", summary: "Thông tin văn phòng liên hệ Feltre (BL) - Italia.", content: "lien he van phong feltre italia hot line email" }
        ];

        allArticles = allArticles.concat(staticPages);

        // 3. Lọc tất cả bài viết/trang chứa từ khóa ở bất kỳ ngóc ngách nào
        const results = allArticles.filter(item => {
            const title = (item.title || '').toLowerCase();
            const summary = (item.summary || '').toLowerCase();
            const content = (item.content || '').toLowerCase();
            const category = (item.category || '').toLowerCase();

            return title.includes(query) || 
                   summary.includes(query) || 
                   content.includes(query) || 
                   category.includes(query);
        });

        res.json({ success: true, total: results.length, results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi tìm kiếm", error: error.message });
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