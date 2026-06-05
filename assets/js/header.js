// File: assets/js/header.js
const vioraHeader = `
<header class="viora-header">
    <div class="container d-flex justify-content-between align-items-center">
        
        <a href="index.html" class="navbar-brand viora-brand-lockup d-inline-flex align-items-center gap-3 text-white text-decoration-none" aria-label="VIORA — Trang chủ">
            <img src="assets/images/logo.png" alt="" class="viora-brand-logo" height="100">
            <span class="viora-brand-text premium-font">VIORA</span>
        </a>

        <ul class="nav d-none d-lg-flex">
            <li class="nav-item has-mega">
                <a class="nav-link" href="shop.html">CỬA HÀNG <i class="fa-light fa-chevron-down ms-1" style="font-size: 10px;"></i></a>
                <div class="mega-menu">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-3">
                                <h6 class="mega-title">TRANG PHỤC</h6>
                                <ul class="list-unstyled mega-list">
                                    <li><a href="shop.html?cat=ao-khoac">Áo khoác</a></li>
                                    <li><a href="shop.html?cat=ao">Các loại áo</a></li>
                                    <li><a href="shop.html?cat=dam">Đầm / Váy</a></li>
                                    <li><a href="shop.html?cat=quan">Quần</a></li>
                                </ul>
                            </div>
                            <div class="col-md-3">
                                <h6 class="mega-title">PHỤ KIỆN</h6>
                                <ul class="list-unstyled mega-list">
                                    <li><a href="shop.html?cat=day-chuyen">Dây chuyền</a></li>
                                    <li><a href="shop.html?cat=vong-tay">Vòng tay</a></li>
                                    <li><a href="shop.html?cat=tui-xach">Túi xách</a></li>
                                    <li><a href="shop.html?cat=giay">Giày</a></li>
                                </ul>
                            </div>
                            <div class="col-md-6 border-start border-secondary ps-5">
                                <div class="mega-promo text-white">
                                    <p class="small opacity-50 mb-1">CẬT NHẬT MỚI NHẤT 2026</p>
                                    <h3 class="premium-font mb-3">PHONG CÁCH TỐI GIẢN</h3>
                                    <a href="shop.html" class="btn btn-outline-light rounded-0 btn-sm px-4">KHÁM PHÁ</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="nav-item"><a class="nav-link" href="shop.html?cat=ao-khoac">Trang phục</a></li>
            <li class="nav-item"><a class="nav-link" href="shop.html?cat=day-chuyen">Phụ kiện</a></li>
            <li class="nav-item"><a class="nav-link" href="introduction.html">Về chúng tôi</a></li>
            <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="vip.html">Đăng kí VIP</a></li>
        </ul>

        <div class="viora-icons-group d-flex align-items-center gap-3 gap-md-4">
            <button type="button" class="viora-icon" id="viora-search-trigger" aria-label="Tìm kiếm sản phẩm"><i class="fas fa-search"></i></button>
            <a href="login.html" class="viora-icon d-none d-md-block"><i class="fas fa-user"></i></a>
            <a href="cart.html" class="viora-icon position-relative">
                <i class="fas fa-shopping-bag"></i>
                <span id="cart-count" class="viora-cart-badge">0</span>
            </a>
            
            <button class="btn btn-link text-white d-lg-none p-0 ms-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#vioraMobileMenu" style="text-decoration: none;">
                <i class="fa-solid fa-bars fs-4"></i>
            </button>
        </div>
    </div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="vioraMobileMenu" style="background-color: #111; color: #fff;">
        <div class="offcanvas-header border-bottom border-secondary px-4 py-3">
            <h5 class="offcanvas-title premium-font" style="letter-spacing: 3px;">VIORA</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Đóng"></button>
        </div>
        <div class="offcanvas-body px-4">
            <ul class="navbar-nav fs-6 gap-3 mt-4 text-uppercase" style="letter-spacing: 1px;">
                <li class="nav-item"><a class="nav-link text-white" href="shop.html">Tất cả sản phẩm</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="shop.html?cat=dam">Trang phục</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="shop.html?cat=day-chuyen">Phụ kiện</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="introduction.html">Giới thiệu</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="blog.html">Tạp chí (Blog)</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="vip.html">Đăng kí VIP</a></li>
                
                <li class="nav-item mt-4 pt-4 border-top border-secondary">
                    <a class="nav-link text-white opacity-75" href="login.html"><i class="fas fa-user me-2"></i> Tài khoản của tôi</a>
                </li>
            </ul>
        </div>
    </div>
</header>
`;