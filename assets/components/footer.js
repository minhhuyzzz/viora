document.addEventListener("DOMContentLoaded", function() {
    const footerRoot = document.getElementById('footer-root');
    if (footerRoot) {
        footerRoot.innerHTML = `
        <footer class="viora-footer">
            <div class="container text-center">
                <h2 class="premium-font mb-4 text-white">VIORA</h2>
                <p class="small opacity-50 mb-4 text-white">THE ESSENCE OF MINIMALISM</p>
                <div class="d-flex justify-content-center gap-4 mb-4 text-white">
                    <i class="fa-brands fa-facebook-f"></i>
                    <i class="fa-brands fa-instagram"></i>
                    <i class="fa-brands fa-tiktok"></i>
                </div>
                <hr style="border-color: rgba(255,255,255,0.1)">
                <p class="small opacity-50 mb-0 text-white">© 2024 VIORA FASHION. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
        `;
    }
});