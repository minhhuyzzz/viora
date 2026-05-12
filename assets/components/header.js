document.addEventListener("DOMContentLoaded", function() {
    const headerRoot = document.getElementById('header-root');
    if (headerRoot) {
        headerRoot.innerHTML = `
        <nav class="navbar navbar-expand-lg viora-header">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <img src="assets/img/logo-viora.png" alt="VIORA" height="30" class="main-logo">
                </a>
                <div class="collapse navbar-collapse justify-content-center">
                    <ul class="navbar-nav gap-4">
                        <li class="nav-item"><a class="nav-link" href="index.html">TRANG CHỦ</a></li>
                        <li class="nav-item"><a class="nav-link" href="shop.html">TRANG PHỤC</a></li>
                        <li class="nav-item"><a class="nav-link" href="shop.html">PHỤ KIỆN</a></li>
                        <li class="nav-item"><a class="nav-link" href="vip.html">VIORA VIP</a></li>
                    </ul>
                </div>
                <div class="header-icons d-flex gap-3 text-white">
                    <i class="fa-light fa-magnifying-glass"></i>
                    <i class="fa-light fa-bag-shopping"></i>
                </div>
            </div>
        </nav>
        `;
    }
});