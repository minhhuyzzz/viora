/* ============================================================
   VIORA — STORAGE & AUTHENTICATION
   ============================================================ */

const Auth = {
    // 1. Lấy danh sách tất cả tài khoản
    getUsers: function() {
        return JSON.parse(localStorage.getItem('viora_users') || '[]');
    },

    // 2. Lấy người dùng đang đăng nhập hiện tại
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem('viora_user') || 'null');
    },

    // 3. Đăng ký tài khoản mới
    register: function(name, email, pass) {
        let users = this.getUsers();
        
        // Kiểm tra email trùng
        if (users.find(u => u.email === email)) {
            return { success: false, msg: "Email này đã được sử dụng!" };
        }

        // Tạo user mới và lưu vào mảng
        const newUser = { name: name, email: email, pass: pass };
        users.push(newUser);
        localStorage.setItem('viora_users', JSON.stringify(users));

        // Tự động đăng nhập luôn
        localStorage.setItem('viora_user', JSON.stringify({ ...newUser, loggedIn: true }));
        return { success: true, msg: "Đăng ký thành công!" };
    },

    // 4. Đăng nhập
    login: function(email, pass) {
        let users = this.getUsers();
        let user = users.find(u => u.email === email && u.pass === pass);
        
        if (user) {
            localStorage.setItem('viora_user', JSON.stringify({ ...user, loggedIn: true }));
            return { success: true, msg: "Đăng nhập thành công!" };
        }
        return { success: false, msg: "Email hoặc mật khẩu không chính xác!" };
    },

    // 5. Đăng xuất
    logout: function() {
        localStorage.removeItem('viora_user');
        window.location.reload();
    }
};