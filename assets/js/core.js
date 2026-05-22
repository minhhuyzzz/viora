$(document).ready(function() {
   

    // INJECT VÀO TRANG
    $('#header-root').html(vioraHeader);
    $('#footer-root').html(vioraFooter);

    initVioraGlobalSearchUI();

    renderFeaturedProducts();

    // 3. RENDER SẢN PHẨM TRANG CHỦ (Nếu có)
    if ($('#featured-products').length > 0 && typeof VIORA_PRODUCTS !== 'undefined') {
        let pHTML = '';
        VIORA_PRODUCTS.slice(0, 4).forEach(p => {
            pHTML += `
                <div class="col-6 col-md-3">
                    <div class="product-card">
                        <div class="product-img-box">
                            <img src="${p.images[0]}" alt="${p.name}">
                        </div>
                        <div class="product-name">${p.name}</div>
                        <div class="product-price">${p.price} VNĐ</div>
                    </div>
                </div>`;
        });
        $('#featured-products').html(pHTML);
    }
    // ĐIỀU KHIỂN VIDEO
const mainVideo = document.getElementById('viora-main-video');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnMute = document.getElementById('btn-mute');

if (mainVideo) {
    // Xử lý Play/Pause
    btnPlayPause.addEventListener('click', function() {
        if (mainVideo.paused) {
            mainVideo.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            mainVideo.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Xử lý Mute/Unmute
    btnMute.addEventListener('click', function() {
        if (mainVideo.muted) {
            mainVideo.muted = false;
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            mainVideo.muted = true;
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}
});

// --- HÀM TỰ ĐỘNG LẤY SẢN PHẨM TỪ DATA ---
function renderFeaturedProducts() {
    // Kiểm tra xem có file data và có khung để in ra không
    if (typeof VIORA_PRODUCTS === 'undefined' || $('#viora-product-grid').length === 0) return;

    // Lấy 4 sản phẩm đầu tiên để đưa ra trang chủ
    const featuredProducts = VIORA_PRODUCTS.slice(0, 4);
    let productHTML = '';

    featuredProducts.forEach(product => {
        // Xử lý ảnh (Lấy ảnh đầu tiên làm ảnh chính, ảnh thứ 2 làm ảnh hover)
        // Nếu sản phẩm chỉ có 1 ảnh thì ảnh hover sẽ lấy luôn ảnh chính
        const imgs = product.images && product.images.length ? product.images : [];
        const imgPrimary = imgs[0] || 'assets/images/logo.png';
        const imgSecondary = imgs[1] ? imgs[1] : imgPrimary;
        
        // Xử lý Tag (Nếu có)
        const tagHTML = product.tag ? `<span class="badge-new">${product.tag}</span>` : '';

        productHTML += `
        <div class="col-6 col-md-3">
            <div class="viora-product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
                <div class="product-img-wrap">
                    ${tagHTML}
                    <img src="${imgPrimary}" class="img-primary" alt="${product.name}">
                    <img src="${imgSecondary}" class="img-secondary" alt="${product.name}">
                    
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
                        <i class="fa-solid fa-bag-shopping"></i>
                    </button>
                </div>
                <div class="product-info mt-3">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.price}₫</div>
                </div>
            </div>
        </div>`;
    });

    // Bơm toàn bộ HTML vừa tạo vào khung
    $('#viora-product-grid').html(productHTML);
}


// --- Lệnh điều khiển Slider Chất Liệu ---
$(document).ready(function() {
    const matSlider = document.getElementById('viora-material-slider');
    const btnMatPrev = document.getElementById('btn-mat-prev');
    const btnMatNext = document.getElementById('btn-mat-next');

    if (matSlider && btnMatPrev && btnMatNext) {
        btnMatPrev.addEventListener('click', () => {
            // Tính toán độ rộng của 1 card + khoảng cách (gap) để trượt chính xác
            const itemWidth = matSlider.querySelector('.material-card').offsetWidth + 30; 
            matSlider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });

        btnMatNext.addEventListener('click', () => {
            const itemWidth = matSlider.querySelector('.material-card').offsetWidth + 30;
            matSlider.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });
    }
});



// Lệnh điều khiển FAQ Accordion
$('.faq-question').on('click', function() {
    const item = $(this).parent();
    
    // Đóng các câu hỏi khác (nếu muốn mở đồng thời thì xóa đoạn này)
    item.siblings().removeClass('active');
    
    // Đóng/Mở câu hỏi hiện tại
    item.toggleClass('active');
});



/* ============================================================
   VIORA — CORE ENGINE 2026 (Gộp Utility, Cart, User, UI)
   ============================================================ */

/* ── 1. UTILITIES (Hàm bổ trợ) ────────────────────────────── */
function parsePrice(str) {
    if (typeof str === 'number') return str;
    return parseInt(String(str).replace(/\./g, ''), 10) || 0;
  }
  
  function formatPrice(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  }
  
  // Hàm fix ảnh "thần thánh": Chấp mọi loại đường dẫn trong file data của Huy
  function imgSrc(path) {
    if (!path) return 'assets/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    // Xoá dấu / ở đầu nếu có
    let p = path.startsWith('/') ? path.substring(1) : path;
    // Nếu đã có assets/ ở đầu thì để yên, nếu chưa thì thêm vào
    if (p.startsWith('assets/')) return p;
    if (p.startsWith('images/')) return 'assets/' + p;
    return 'assets/images/' + p;
  }
  
  function getInitial(name) { return (name || '?').charAt(0).toUpperCase(); }
  
  /* ── 2. STORAGE & CART ───────────────────────────────────── */
  var Store = {
    get: function(k) { try { var d = localStorage.getItem(k); return d ? JSON.parse(d) : null; } catch(e){ return null; } },
    set: function(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
    del: function(k) { try { localStorage.removeItem(k); } catch(e){} }
  };
  
  var Cart = {
    getAll: function() { return Store.get('viora_cart') || []; },
    count:  function() { return this.getAll().reduce(function(s,i){ return s+i.qty; }, 0); },
    total:  function() { return this.getAll().reduce(function(s,i){ return s+i.price*i.qty; }, 0); },
    add: function(product, size, qty) {
      qty = qty || 1;
      var cartId = product.id + '__' + (size || '');
      var cart = this.getAll();
      var found = cart.filter(function(i){ return i.cartId === cartId; })[0];
      if (found) { found.qty += qty; } 
      else {
        cart.push({
          cartId: cartId, id: product.id, name: product.name,
          price: parsePrice(product.price), image: imgSrc(product.images[0]),
          size: size || 'Freesize', qty: qty
        });
      }
      Store.set('viora_cart', cart);
      this.updateBadge();
      showToast('🛍️ Đã thêm vào giỏ hàng', 'success');
    },
    updateBadge: function() {
      var n = this.count();
      var badge = document.getElementById('cart-count') || document.querySelector('.viora-cart-badge');
      if (badge) {
        badge.textContent = n || '';
        badge.style.display = n > 0 ? 'flex' : 'none';
      }
    }
  };
  
  

  
  function showToast(msg, type = 'success') {
    var c = document.getElementById('toast-container') || (function(){
      var div = document.createElement('div'); div.id = 'toast-container'; div.className = 'toast-container';
      document.body.appendChild(div); return div;
    })();
    var t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.innerHTML = `<span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 3000);
  }

  function vioraEscapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function vioraFilterProductsForSearch(q, limit) {
    limit = limit || 8;
    if (!q || typeof VIORA_PRODUCTS === 'undefined') return [];
    var t = String(q).toLowerCase().trim();
    if (!t) return [];
    return VIORA_PRODUCTS.filter(function(p) {
      var name = (p.name || '').toLowerCase();
      var cat = (p.category || '').toLowerCase();
      var desc = (p.description || '').toLowerCase();
      return name.indexOf(t) !== -1 || cat.indexOf(t) !== -1 || desc.indexOf(t) !== -1;
    }).slice(0, limit);
  }

  function initVioraGlobalSearchUI() {
    if (document.getElementById('viora-search-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'viora-search-overlay';
    overlay.className = 'viora-search-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="viora-search-overlay__backdrop" tabindex="-1"></div>' +
      '<div class="viora-search-overlay__panel" role="dialog" aria-modal="true" aria-labelledby="viora-search-title">' +
      '  <div class="viora-search-overlay__head">' +
      '    <h2 id="viora-search-title" class="viora-search-overlay__title">Tìm sản phẩm</h2>' +
      '    <button type="button" class="viora-search-overlay__close" id="viora-search-close" aria-label="Đóng">&times;</button>' +
      '  </div>' +
      '  <div class="viora-search-overlay__field">' +
      '    <i class="fas fa-search" aria-hidden="true"></i>' +
      '    <input type="search" id="viora-global-search-input" class="viora-search-overlay__input" placeholder="Nhập tên, danh mục…" autocomplete="off">' +
      '  </div>' +
      '  <div id="viora-global-search-results" class="viora-search-overlay__results"></div>' +
      '  <div class="viora-search-overlay__actions">' +
      '    <a href="#" class="viora-search-overlay__link-all" id="viora-search-see-all">Xem tất cả trong cửa hàng</a>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(overlay);

    var input = document.getElementById('viora-global-search-input');
    var resultsEl = document.getElementById('viora-global-search-results');
    var seeAll = document.getElementById('viora-search-see-all');
    var debounceTimer;

    function closeSearch() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (input) input.value = '';
      if (resultsEl) resultsEl.innerHTML = '';
    }

    function openSearch() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(function() { if (input) input.focus(); }, 50);
      renderResults(input ? input.value : '');
    }

    function goShopWithQuery(q) {
      var t = (q || '').trim();
      closeSearch();
      window.location.href = 'shop.html' + (t ? ('?q=' + encodeURIComponent(t)) : '');
    }

    function renderResults(q) {
      if (!resultsEl) return;
      var qs = String(q || '');
      var list = vioraFilterProductsForSearch(qs, 8);
      if (!qs.trim()) {
        resultsEl.innerHTML = '<p class="viora-search-overlay__hint">Gõ từ khóa để xem gợi ý hoặc mở cửa hàng.</p>';
        return;
      }
      if (list.length === 0) {
        resultsEl.innerHTML = '<p class="viora-search-overlay__hint">Không có gợi ý. Bấm <strong>Xem tất cả trong cửa hàng</strong> để lọc đầy đủ.</p>';
        return;
      }
      resultsEl.innerHTML = list.map(function(p) {
        var img = typeof imgSrc === 'function' ? imgSrc(p.images && p.images[0]) : 'assets/images/placeholder.jpg';
        var price = typeof formatPrice === 'function' && typeof parsePrice === 'function'
          ? formatPrice(parsePrice(p.price))
          : (p.price || '');
        return (
          '<a class="viora-search-result-row" href="product-detail.html?id=' + encodeURIComponent(String(p.id)) + '">' +
          '  <span class="viora-search-result-row__img"><img src="' + vioraEscapeHtml(img) + '" alt="' + vioraEscapeHtml(p.name || '') + '"></span>' +
          '  <span class="viora-search-result-row__meta">' +
          '    <span class="viora-search-result-row__name">' + vioraEscapeHtml(p.name) + '</span>' +
          '    <span class="viora-search-result-row__cat">' + vioraEscapeHtml(p.category || '') + '</span>' +
          '  </span>' +
          '  <span class="viora-search-result-row__price">' + vioraEscapeHtml(price) + '</span>' +
          '</a>'
        );
      }).join('');
    }

    if (seeAll) {
      seeAll.addEventListener('click', function(e) {
        e.preventDefault();
        goShopWithQuery(input ? input.value : '');
      });
    }

    overlay.querySelector('.viora-search-overlay__backdrop').addEventListener('click', closeSearch);
    document.getElementById('viora-search-close').addEventListener('click', closeSearch);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeSearch();
    });

    if (!window.__vioraSearchTriggerBound) {
      window.__vioraSearchTriggerBound = true;
      document.addEventListener('click', function(e) {
        var btn = e.target && e.target.closest && e.target.closest('#viora-search-trigger');
        if (!btn) return;
        e.preventDefault();
        openSearch();
      });
    }

    if (input) {
      input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        var val = input.value;
        debounceTimer = setTimeout(function() { renderResults(val); }, 200);
      });
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          goShopWithQuery(input.value);
        }
      });
    }
  }
  
 // 4. KHỞI CHẠY KHI TRANG LOAD XONG
document.addEventListener('DOMContentLoaded', function() {
    // Đổ Header/Footer (Nếu dùng cách này)
    if(typeof injectLayout === 'function') injectLayout(); 
    
    // Check giỏ hàng
    if(window.Cart && Cart.updateBadge) Cart.updateBadge(); 
    
    // HIỆU ỨNG HEADER THÔNG MINH CHECK LOGIN
    setTimeout(() => {
        let user = JSON.parse(localStorage.getItem('viora_user'));
const userIcon = document.querySelector('a[href="login.html"]'); 

if (user && user.loggedIn && userIcon) {
    userIcon.outerHTML = `
        <div class="user-logged-in">
            <a href="#" class="user-nav-link">
                <i class="fa-regular fa-user"></i> ${user.name.split(' ')[0]}
            </a>
            <div class="user-dropdown-menu">
                <a href="profile.html"><i class="fa-regular fa-id-card me-2"></i> Tài khoản của tôi</a>
                <a href="orders.html"><i class="fa-solid fa-clock-rotate-left me-2"></i> Đơn hàng đã mua</a>
                <hr style="margin: 5px 0; opacity: 0.1;">
                <div style="height: 1px; background: #eee; margin: 5px 0;"></div>
            <a href="#" onclick="vioraLogout(event)" style="color: #dc3545;">
            <i class="fa-solid fa-arrow-right-from-bracket" style="color: #dc3545;"></i> Đăng xuất
            </a>
            </div>
        </div>
    `;
}
    }, 100);
});

// Hàm Đăng xuất
window.vioraLogout = function(e) {
    if (e) e.preventDefault(); // Chặn việc load lại trang của thẻ a
    localStorage.removeItem('viora_user'); // Xóa trí nhớ trình duyệt
    window.location.href = 'login.html'; // Đá khách về lại trang đăng nhập
};