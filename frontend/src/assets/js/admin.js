import '../css/style.css'; 

const API_URL = 'https://vietitalia.onrender.com/api'; 
// const API_URL = 'http://localhost:5000/api'; 

const ITEMS_PER_PAGE = 5; 
let currentEventPage = 1;
let currentTravelPage = 1;
let currentTrainingPage = 1;

let localEvents = []; 
let localTravels = []; 
let localTrainings = [];

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('admin_token');
    
    options.headers = options.headers || {};
    
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, options);
    
    // Nếu hết hạn token hoặc không hợp lệ -> Bắt đăng nhập lại
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        alert('🔒 Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!');
        location.reload();
    }
    
    return response;
}
// XỬ LÝ ĐĂNG NHẬP / ĐĂNG XUẤT VÀ HIỂN 
function checkAuthAndInit() {
    const token = localStorage.getItem('admin_token');
    const loginSection = document.getElementById('loginSection');
    const adminDashboard = document.getElementById('adminDashboard');

    if (!token) {
        if (loginSection) loginSection.classList.remove('hidden');
        if (adminDashboard) adminDashboard.classList.add('hidden');
    } else {
        if (loginSection) loginSection.classList.add('hidden');
        if (adminDashboard) adminDashboard.classList.remove('hidden');

        // Tải dữ liệu khi đã xác thực
        fetchEvents(); 
        fetchTravels(); 
        fetchTrainings();
    }
}

// Xử lý Submit Form Đăng nhập
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login_username').value.trim();
        const password = document.getElementById('login_password').value.trim();

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success && result.token) {
                localStorage.setItem('admin_token', result.token);
                alert('🎉 ' + (result.message || 'Đăng nhập thành công!'));
                checkAuthAndInit();
            } else {
                alert('❌ ' + (result.message || 'Đăng nhập thất bại!'));
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            alert('❌ Lỗi kết nối tới Server!');
        }
    });
}

// Nút Đăng xuất
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
            localStorage.removeItem('admin_token');
            location.reload();
        }
    });
}

// CHUYỂN TAB CẤU 
const tabEventBtn = document.getElementById('tabEventBtn'); 
const tabTravelBtn = document.getElementById('tabTravelBtn'); 
const tabTrainingBtn = document.getElementById('tabTrainingBtn');
const eventSection = document.getElementById('eventSection'); 
const travelSection = document.getElementById('travelSection'); 
const trainingSection = document.getElementById('trainingSection');

const activeClass = {
    event: "py-2 px-4 font-bold text-lg text-primary border-b-2 border-primary focus:outline-none",
    travel: "py-2 px-4 font-bold text-lg text-secondary border-b-2 border-secondary focus:outline-none",
    training: "py-2 px-4 font-bold text-lg text-amber-600 border-b-2 border-amber-600 focus:outline-none",
};
const inactiveClass = {
    event: "py-2 px-4 font-bold text-lg text-gray-500 hover:text-primary focus:outline-none",
    travel: "py-2 px-4 font-bold text-lg text-gray-500 hover:text-secondary focus:outline-none",
    training: "py-2 px-4 font-bold text-lg text-gray-500 hover:text-amber-600 focus:outline-none",
};

function showTab(tab) {
    if (tabEventBtn) tabEventBtn.className = tab === 'event' ? activeClass.event : inactiveClass.event;
    if (tabTravelBtn) tabTravelBtn.className = tab === 'travel' ? activeClass.travel : inactiveClass.travel;
    if (tabTrainingBtn) tabTrainingBtn.className = tab === 'training' ? activeClass.training : inactiveClass.training;

    if (eventSection) eventSection.classList.toggle('hidden', tab !== 'event');
    if (travelSection) travelSection.classList.toggle('hidden', tab !== 'travel');
    if (trainingSection) trainingSection.classList.toggle('hidden', tab !== 'training');
}

if (tabEventBtn) tabEventBtn.addEventListener('click', () => showTab('event'));
if (tabTravelBtn) tabTravelBtn.addEventListener('click', () => showTab('travel'));
if (tabTrainingBtn) tabTrainingBtn.addEventListener('click', () => showTab('training'));

// 1. QUẢN LÝ SỰ KIỆN (EVENTS CRUD
const eventForm = document.getElementById('addEventForm'); 
const eventTableBody = document.getElementById('eventTableBody'); 

const eventPageInfo = document.getElementById('eventPageInfo');
const eventPrevBtn = document.getElementById('eventPrevBtn');
const eventNextBtn = document.getElementById('eventNextBtn');

async function fetchEvents() { 
    try {
        const response = await fetch(`${API_URL}/events`); 
        const result = await response.json(); 
        if (result.success) { 
            localEvents = result.data; 
            currentEventPage = 1;
            renderEvents();
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách sự kiện:', error); 
    }
}

function renderEvents() {
    if (!eventTableBody) return;
    const totalPages = Math.ceil(localEvents.length / ITEMS_PER_PAGE) || 1;
    
    if (currentEventPage > totalPages) currentEventPage = totalPages;
    if (currentEventPage < 1) currentEventPage = 1;

    const startIndex = (currentEventPage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = localEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (eventPageInfo) eventPageInfo.innerText = `Trang ${currentEventPage} / ${totalPages} (Tổng số: ${localEvents.length})`;
    if (eventPrevBtn) eventPrevBtn.disabled = currentEventPage === 1;
    if (eventNextBtn) eventNextBtn.disabled = currentEventPage === totalPages;

    eventTableBody.innerHTML = paginatedEvents.map(ev => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">${ev.title}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded font-bold ${ev.lang === 'vi' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">${ev.lang ? ev.lang.toUpperCase() : 'VI'}</span></td>
            <td class="px-4 py-3 text-gray-500">${ev.location || '-'}</td>
            
            <td class="px-4 py-3 text-center">
                ${ev.media_folder 
                    ? `<span class="px-2 py-1 text-xs font-mono font-bold bg-blue-50 text-blue-700 rounded border border-blue-200">${ev.media_folder}</span>` 
                    : `<span class="px-2 py-1 text-xs font-bold bg-amber-50 text-amber-600 rounded border border-amber-200">Trống</span>`
                }
            </td>
            
            <td class="px-4 py-3 text-xs text-gray-400 font-mono">${ev.slug || '-'}</td>
            <td class="px-4 py-3 text-gray-500">${ev.event_date ? ev.event_date.split('T')[0] : '-'}</td>
            <td class="px-4 py-3 text-center space-x-2">
                <button onclick="editEvent(${ev.id})" class="text-blue-600 hover:text-blue-900 font-semibold">Sửa</button>
                <button onclick="deleteEvent(${ev.id})" class="text-red-600 hover:text-red-900 font-semibold">Xóa</button>
            </td>
        </tr>
    `).join(''); 
}

if (eventPrevBtn) {
    eventPrevBtn.addEventListener('click', () => {
        if (currentEventPage > 1) { currentEventPage--; renderEvents(); }
    });
}

if (eventNextBtn) {
    eventNextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(localEvents.length / ITEMS_PER_PAGE);
        if (currentEventPage < totalPages) { currentEventPage++; renderEvents(); }
    });
}

if (eventForm) {
    eventForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        const eventId = document.getElementById('event_id').value; 
        const titleVal = document.getElementById('event_title').value;
        let slugVal = document.getElementById('event_slug').value;

        if (!slugVal) {
            slugVal = titleVal.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }
        
        const formData = new FormData(); 
        formData.append('title', titleVal); 
        formData.append('slug', slugVal); 
        formData.append('location', document.getElementById('event_location').value); 
        
        const dateVal = document.getElementById('event_date').value; 
        if (dateVal) formData.append('event_date', dateVal); 
        
        formData.append('description', document.getElementById('event_description').value); 
        formData.append('status', 'upcoming'); 
        formData.append('lang', document.getElementById('event_lang').value); 

        const fileInput = document.getElementById('event_media_file'); 
        if (fileInput && fileInput.files.length > 0) { 
            for (let i = 0; i < fileInput.files.length; i++) { 
                formData.append('media', fileInput.files[i]); 
            }
        }

        const url = eventId ? `${API_URL}/events/${eventId}` : `${API_URL}/events`; 
        const method = eventId ? 'PUT' : 'POST'; 

        try {
            // DÙNG fetchWithAuth BẢO VỆ API
            const response = await fetchWithAuth(url, { method, body: formData }); 
            const result = await response.json(); 

            if (result.success) { 
                alert(eventId ? '🎉 Cập nhật sự kiện thành công!' : '🎉 Thêm sự kiện thành công!'); 
                resetEventForm(); 
                fetchEvents(); 
            } else {
                alert('❌ Thất bại: ' + result.message); 
            }
        } catch (error) {
            console.error(error); 
            alert('❌ Lỗi kết nối server!'); 
        }
    });
}

window.editEvent = function(id) { 
    const ev = localEvents.find(item => item.id === id); 
    if (!ev) return; 

    document.getElementById('event_id').value = ev.id; 
    document.getElementById('event_title').value = ev.title; 
    document.getElementById('event_slug').value = ev.slug || ''; 
    document.getElementById('event_location').value = ev.location || ''; 
    document.getElementById('event_date').value = ev.event_date ? ev.event_date.split('T')[0] : ''; 
    document.getElementById('event_description').value = ev.description || ''; 
    document.getElementById('event_lang').value = ev.lang || 'vi'; 

    document.getElementById('eventFormTitle').innerText = "📝 Chỉnh Sửa Sự Kiện"; 
    document.getElementById('eventSubmitBtn').innerText = "Cập Nhật Sự Kiện"; 
    document.getElementById('eventCancelBtn').classList.remove('hidden'); 
    document.getElementById('event_media_note').classList.remove('hidden'); 
    
    showTab('event');
}

window.deleteEvent = async function(id) { 
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) return; 
    try {
        // DÙNG fetchWithAuth BẢO VỆ API
        const response = await fetchWithAuth(`${API_URL}/events/${id}`, { 
            method: 'DELETE' 
        }); 
        const result = await response.json(); 
        if (result.success) { 
            alert('🗑️ Đã xóa thành công!'); 
            fetchEvents(); 
        } else {
            alert('❌ Lỗi: ' + result.message);
        }
    } catch (error) {
        alert('❌ Lỗi kết nối!'); 
    }
}

function resetEventForm() { 
    if (!eventForm) return;
    eventForm.reset(); 
    document.getElementById('event_id').value = ''; 
    document.getElementById('eventFormTitle').innerText = "🎉 Thêm Sự Kiện Mới"; 
    document.getElementById('eventSubmitBtn').innerText = "Lưu Sự Kiện"; 
    document.getElementById('eventCancelBtn').classList.add('hidden'); 
    document.getElementById('event_media_note').classList.add('hidden'); 
}
const eventCancelBtn = document.getElementById('eventCancelBtn');
if (eventCancelBtn) eventCancelBtn.addEventListener('click', resetEventForm);

// 2. CẨM NANG DU LỊCH (TRAVELS CRUD
const travelForm = document.getElementById('addTravelForm'); 
const travelTableBody = document.getElementById('travelTableBody'); 

const travelPageInfo = document.getElementById('travelPageInfo');
const travelPrevBtn = document.getElementById('travelPrevBtn');
const travelNextBtn = document.getElementById('travelNextBtn');

async function fetchTravels() { 
    try {
        const response = await fetch(`${API_URL}/travels`); 
        const result = await response.json(); 
        if (result.success) { 
            localTravels = result.data; 
            currentTravelPage = 1; 
            renderTravels();
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách du lịch:', error); 
    }
}

function renderTravels() {
    if (!travelTableBody) return;
    const totalPages = Math.ceil(localTravels.length / ITEMS_PER_PAGE) || 1;
    
    if (currentTravelPage > totalPages) currentTravelPage = totalPages;
    if (currentTravelPage < 1) currentTravelPage = 1;

    const startIndex = (currentTravelPage - 1) * ITEMS_PER_PAGE;
    const paginatedTravels = localTravels.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (travelPageInfo) travelPageInfo.innerText = `Trang ${currentTravelPage} / ${totalPages} (Tổng số: ${localTravels.length})`;
    if (travelPrevBtn) travelPrevBtn.disabled = currentTravelPage === 1;
    if (travelNextBtn) travelNextBtn.disabled = currentTravelPage === totalPages;

    travelTableBody.innerHTML = paginatedTravels.map(tv => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">${tv.title}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded font-bold ${tv.lang === 'vi' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">${tv.lang ? tv.lang.toUpperCase() : 'VI'}</span></td>
            <td class="px-4 py-3 text-gray-500">${tv.category || '-'}</td>
            
            <td class="px-4 py-3 text-center">
                ${tv.media_folder 
                    ? `<span class="px-2 py-1 text-xs font-mono font-bold bg-green-50 text-green-700 rounded border border-green-200">${tv.media_folder}</span>` 
                    : `<span class="px-2 py-1 text-xs font-bold bg-amber-50 text-amber-600 rounded border border-amber-200">Trống</span>`
                }
            </td>
            
            <td class="px-4 py-3 text-xs text-gray-400 font-mono">${tv.slug}</td>
            <td class="px-4 py-3 text-center space-x-2">
                <button onclick="editTravel(${tv.id})" class="text-blue-600 hover:text-blue-900 font-semibold">Sửa</button>
                <button onclick="deleteTravel(${tv.id})" class="text-red-600 hover:text-red-900 font-semibold">Xóa</button>
            </td>
        </tr>
    `).join(''); 
}

if (travelPrevBtn) {
    travelPrevBtn.addEventListener('click', () => {
        if (currentTravelPage > 1) { currentTravelPage--; renderTravels(); }
    });
}

if (travelNextBtn) {
    travelNextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(localTravels.length / ITEMS_PER_PAGE);
        if (currentTravelPage < totalPages) { currentTravelPage++; renderTravels(); }
    });
}

if (travelForm) {
    travelForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        const travelId = document.getElementById('travel_id').value; 
        const titleVal = document.getElementById('travel_title').value; 
        let slugVal = document.getElementById('travel_slug').value; 

        if (!slugVal) { 
            slugVal = titleVal.toLowerCase() 
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                .replace(/[^a-z0-9 -]/g, '') 
                .replace(/\s+/g, '-') 
                .replace(/-+/g, '-'); 
        }

        const formData = new FormData(); 
        formData.append('title', titleVal); 
        formData.append('slug', slugVal); 
        formData.append('category', document.getElementById('travel_category').value); 
        formData.append('content', document.getElementById('travel_content').value); 
        formData.append('lang', document.getElementById('travel_lang').value); 

        const travelFileInput = document.getElementById('travel_media_file'); 
        if (travelFileInput && travelFileInput.files.length > 0) { 
            for (let i = 0; i < travelFileInput.files.length; i++) { 
                formData.append('media', travelFileInput.files[i]); 
            }
        }

        const url = travelId ? `${API_URL}/travels/${travelId}` : `${API_URL}/travels`; 
        const method = travelId ? 'PUT' : 'POST'; 

        try {
            // DÙNG fetchWithAuth BẢO VỆ API
            const response = await fetchWithAuth(url, { method, body: formData }); 
            const result = await response.json(); 

            if (result.success) { 
                alert(travelId ? '✈️ Cập nhật bài viết thành công!' : '✈️ Thêm bài viết thành công!'); 
                resetTravelForm(); 
                fetchTravels(); 
            } else {
                alert('❌ Lỗi: ' + result.message); 
            }
        } catch (error) {
            console.error(error); 
            alert('❌ Lỗi kết nối Server!'); 
        }
    });
}

window.editTravel = function(id) { 
    const tv = localTravels.find(item => item.id === id); 
    if (!tv) return; 

    document.getElementById('travel_id').value = tv.id; 
    document.getElementById('travel_title').value = tv.title; 
    document.getElementById('travel_slug').value = tv.slug; 
    document.getElementById('travel_category').value = tv.category || ''; 
    document.getElementById('travel_content').value = tv.content || ''; 
    document.getElementById('travel_lang').value = tv.lang || 'vi'; 

    document.getElementById('travelFormTitle').innerText = "📝 Chỉnh Sửa Bài Du Lịch"; 
    document.getElementById('travelSubmitBtn').innerText = "Cập Nhật Bài Viết"; 
    document.getElementById('travelCancelBtn').classList.remove('hidden'); 
    document.getElementById('travel_media_note').classList.remove('hidden'); 

    showTab('travel');
}

window.deleteTravel = async function(id) { 
    if (!confirm('Bạn có chắc muốn xóa bài viết cẩm nang này không?')) return; 
    try {
        // DÙNG fetchWithAuth BẢO VỆ API
        const response = await fetchWithAuth(`${API_URL}/travels/${id}`, { method: 'DELETE' }); 
        const result = await response.json(); 
        if (result.success) { 
            alert('🗑️ Đã xóa bài viết thành công!'); 
            fetchTravels(); 
        } else {
            alert('❌ Lỗi xóa: ' + result.message); 
        }
    } catch (error) {
        alert('❌ Không thể kết nối tới Server!'); 
    }
}

function resetTravelForm() { 
    if (!travelForm) return;
    travelForm.reset(); 
    document.getElementById('travel_id').value = ''; 
    document.getElementById('travelFormTitle').innerText = "✈️ Thêm Bài Du Lịch Mới"; 
    document.getElementById('travelSubmitBtn').innerText = "Lưu Bài Viết"; 
    document.getElementById('travelCancelBtn').classList.add('hidden'); 
    document.getElementById('travel_media_note').classList.add('hidden'); 
}
const travelCancelBtn = document.getElementById('travelCancelBtn');
if (travelCancelBtn) travelCancelBtn.addEventListener('click', resetTravelForm); 

// 3. QUẢN LÝ ĐÀO TẠO QUỐC TẾ (COURSES CRUD
const trainingForm = document.getElementById('addTrainingForm');
const trainingTableBody = document.getElementById('trainingTableBody');

const trainingPageInfo = document.getElementById('trainingPageInfo');
const trainingPrevBtn = document.getElementById('trainingPrevBtn');
const trainingNextBtn = document.getElementById('trainingNextBtn');

async function fetchTrainings() {
    try {
        const response = await fetch(`${API_URL}/courses`);
        const result = await response.json();
        if (result.success) {
            localTrainings = result.data;
            currentTrainingPage = 1;
            renderTrainings();
        }
    } catch (error) {
        console.error('Lỗi lấy danh sách đào tạo:', error);
    }
}

function renderTrainings() {
    if (!trainingTableBody) return;
    const totalPages = Math.ceil(localTrainings.length / ITEMS_PER_PAGE) || 1;

    if (currentTrainingPage > totalPages) currentTrainingPage = totalPages;
    if (currentTrainingPage < 1) currentTrainingPage = 1;

    const startIndex = (currentTrainingPage - 1) * ITEMS_PER_PAGE;
    const paginatedTrainings = localTrainings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (trainingPageInfo) trainingPageInfo.innerText = `Trang ${currentTrainingPage} / ${totalPages} (Tổng số: ${localTrainings.length})`;
    if (trainingPrevBtn) trainingPrevBtn.disabled = currentTrainingPage === 1;
    if (trainingNextBtn) trainingNextBtn.disabled = currentTrainingPage === totalPages;

    trainingTableBody.innerHTML = paginatedTrainings.map(tr => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">${tr.title}</td>
            <td class="px-4 py-3"><span class="px-2 py-1 text-xs rounded font-bold ${tr.lang === 'vi' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">${tr.lang ? tr.lang.toUpperCase() : 'VI'}</span></td>
            <td class="px-4 py-3 text-gray-500">${tr.duration || '-'}</td>
            <td class="px-4 py-3 text-gray-500">${tr.fee != null && tr.fee !== '' ? `€${tr.fee}` : '-'}</td>

            <td class="px-4 py-3 text-center">
                ${tr.media_folder 
                    ? `<span class="px-2 py-1 text-xs font-mono font-bold bg-amber-50 text-amber-700 rounded border border-amber-200">${tr.media_folder}</span>` 
                    : `<span class="px-2 py-1 text-xs font-bold bg-amber-50 text-amber-600 rounded border border-amber-200">Trống</span>`
                }
            </td>

            <td class="px-4 py-3 text-xs text-gray-400 font-mono">${tr.slug}</td>
            <td class="px-4 py-3 text-center space-x-2">
                <button onclick="editTraining(${tr.id})" class="text-blue-600 hover:text-blue-900 font-semibold">Sửa</button>
                <button onclick="deleteTraining(${tr.id})" class="text-red-600 hover:text-red-900 font-semibold">Xóa</button>
            </td>
        </tr>
    `).join('');
}

if (trainingPrevBtn) {
    trainingPrevBtn.addEventListener('click', () => {
        if (currentTrainingPage > 1) { currentTrainingPage--; renderTrainings(); }
    });
}

if (trainingNextBtn) {
    trainingNextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(localTrainings.length / ITEMS_PER_PAGE);
        if (currentTrainingPage < totalPages) { currentTrainingPage++; renderTrainings(); }
    });
}

if (trainingForm) {
    trainingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const trainingId = document.getElementById('training_id').value;
        const titleVal = document.getElementById('training_title').value;
        let slugVal = document.getElementById('training_slug').value;

        if (!slugVal) {
            slugVal = titleVal.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        const formData = new FormData();
        formData.append('title', titleVal);
        formData.append('slug', slugVal);
        formData.append('duration', document.getElementById('training_duration').value);
        formData.append('fee', document.getElementById('training_fee').value);
        formData.append('description', document.getElementById('training_description').value);
        formData.append('content', document.getElementById('training_content').value);
        formData.append('lang', document.getElementById('training_lang').value);

        const trainingFileInput = document.getElementById('training_media_file');
        if (trainingFileInput && trainingFileInput.files.length > 0) {
            for (let i = 0; i < trainingFileInput.files.length; i++) {
                formData.append('media', trainingFileInput.files[i]);
            }
        }

        const url = trainingId ? `${API_URL}/courses/${trainingId}` : `${API_URL}/courses`;
        const method = trainingId ? 'PUT' : 'POST';

        try {
            // DÙNG fetchWithAuth BẢO VỆ API
            const response = await fetchWithAuth(url, { method, body: formData });
            const result = await response.json();

            if (result.success) {
                alert(trainingId ? '🎓 Cập nhật chương trình thành công!' : '🎓 Thêm chương trình thành công!');
                resetTrainingForm();
                fetchTrainings();
            } else {
                alert('❌ Lỗi: ' + result.message);
            }
        } catch (error) {
            console.error(error);
            alert('❌ Lỗi kết nối Server!');
        }
    });
}

window.editTraining = function(id) {
    const tr = localTrainings.find(item => item.id === id);
    if (!tr) return;

    document.getElementById('training_id').value = tr.id;
    document.getElementById('training_title').value = tr.title;
    document.getElementById('training_slug').value = tr.slug;
    document.getElementById('training_duration').value = tr.duration || '';
    document.getElementById('training_fee').value = tr.fee != null ? tr.fee : '';
    document.getElementById('training_description').value = tr.description || '';
    document.getElementById('training_content').value = tr.content || '';
    document.getElementById('training_lang').value = tr.lang || 'vi';

    document.getElementById('trainingFormTitle').innerText = "📝 Chỉnh Sửa Chương Trình Đào Tạo";
    document.getElementById('trainingSubmitBtn').innerText = "Cập Nhật Chương Trình";
    document.getElementById('trainingCancelBtn').classList.remove('hidden');
    document.getElementById('training_media_note').classList.remove('hidden');

    showTab('training');
}

window.deleteTraining = async function(id) {
    if (!confirm('Bạn có chắc muốn xóa chương trình đào tạo này không?')) return;
    try {
        // DÙNG fetchWithAuth BẢO VỆ API
        const response = await fetchWithAuth(`${API_URL}/courses/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert('🗑️ Đã xóa chương trình thành công!');
            fetchTrainings();
        } else {
            alert('❌ Lỗi xóa: ' + result.message);
        }
    } catch (error) {
        alert('❌ Không thể kết nối tới Server!');
    }
}

function resetTrainingForm() {
    if (!trainingForm) return;
    trainingForm.reset();
    document.getElementById('training_id').value = '';
    document.getElementById('trainingFormTitle').innerText = "🎓 Thêm Chương Trình Đào Tạo Mới";
    document.getElementById('trainingSubmitBtn').innerText = "Lưu Chương Trình";
    document.getElementById('trainingCancelBtn').classList.add('hidden');
    document.getElementById('training_media_note').classList.add('hidden');
}
const trainingCancelBtn = document.getElementById('trainingCancelBtn');
if (trainingCancelBtn) trainingCancelBtn.addEventListener('click', resetTrainingForm);

checkAuthAndInit();