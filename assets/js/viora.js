/* ============================================================
   VIORA — Global JS (Vanilla, no modules, no build tools)
   Chạy trực tiếp từ file:// hoặc bất kỳ web server nào
   ============================================================ */

/* ── Utility ─────────────────────────────────────────────── */
function parsePrice(str) {
  if (typeof str === 'number') return str;
  return parseInt(String(str).replace(/\./g, ''), 10) || 0;
}
function formatPrice(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}
function imgSrc(path) {
  if (!path) return '';
  return path.startsWith('/') ? 'assets/images' + path : path;
}
function getInitial(name) {
  return (name || '?').charAt(0).toUpperCase();
}

/* ── LocalStorage helpers ─────────────────────────────────── */
var Store = {
  get: function(k) {
    try { var d = localStorage.getItem(k); return d ? JSON.parse(d) : null; } catch(e){ return null; }
  },
  set: function(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){}
  },
  del: function(k) { try { localStorage.removeItem(k); } catch(e){} }
};

/* ── Cart ─────────────────────────────────────────────────── */
var Cart = {
  getAll: function() { return Store.get('viora_cart') || []; },
  count:  function() { return this.getAll().reduce(function(s,i){ return s+i.qty; }, 0); },
  total:  function() { return this.getAll().reduce(function(s,i){ return s+i.price*i.qty; }, 0); },
  clear:  function() { Store.del('viora_cart'); },
  add: function(product, size, qty) {
    qty = qty || 1;
    var cartId = product.id + '__' + (size || '');
    var cart   = this.getAll();
    var found  = cart.filter(function(i){ return i.cartId === cartId; })[0];
    if (found) {
      found.qty += qty;
    } else {
      cart.push({
        cartId:  cartId,
        id:      product.id,
        name:    product.name,
        price:   parsePrice(product.price),
        image:   imgSrc(product.images && product.images[0]),
        initial: getInitial(product.name),
        size:    size || '',
        qty:     qty
      });
    }
    Store.set('viora_cart', cart);
    Cart.updateBadge();
  },
  remove: function(cartId) {
    Store.set('viora_cart', this.getAll().filter(function(i){ return i.cartId !== cartId; }));
    Cart.updateBadge();
  },
  updateQty: function(cartId, delta) {
    var cart = this.getAll().map(function(i) {
      if (i.cartId === cartId) { i.qty = Math.max(0, i.qty + delta); }
      return i;
    }).filter(function(i){ return i.qty > 0; });
    Store.set('viora_cart', cart);
    Cart.updateBadge();
  },
  updateBadge: function() {
    var n = this.count();
    var badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = n || '';
      badge.className = 'cart-count' + (n > 0 ? ' visible' : '');
    }
  }
};

/* ── Wishlist ─────────────────────────────────────────────── */
var Wishlist = {
  getAll: function() { return Store.get('viora_wishlist') || []; },
  has: function(id) { return this.getAll().indexOf(String(id)) !== -1; },
  toggle: function(id) {
    var list = this.getAll();
    var sid  = String(id);
    var idx  = list.indexOf(sid);
    if (idx === -1) { list.push(sid); } else { list.splice(idx, 1); }
    Store.set('viora_wishlist', list);
    return idx === -1;
  }
};

/* ── User ─────────────────────────────────────────────────── */
var User = {
  get:       function() { return Store.get('viora_user'); },
  isLogged:  function() { return !!(Store.get('viora_user') || {}).loggedIn; },
  login:     function(u) { Store.set('viora_user', Object.assign({}, u, { loggedIn: true })); },
  logout:    function() { Store.del('viora_user'); }
};

/* ── Toast ─────────────────────────────────────────────────── */
function showToast(msg, type) {
  type = type || 'success';
  var icons = { success: '✓', error: '✕', info: 'ℹ' };
  var c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  var t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.innerHTML = '<span class="toast-icon">' + (icons[type]||'✓') + '</span><span class="toast-message">' + msg + '</span>';
  c.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3800);
}

/* ── Stars ────────────────────────────────────────────────── */
function renderStars(rating) {
  var html = '';
  for (var i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating))      html += '<span class="star filled">★</span>';
    else if (i - 0.5 <= rating)       html += '<span class="star half">★</span>';
    else                               html += '<span class="star empty">☆</span>';
  }
  return html;
}
function fakeRating(id) {
  var seed = String(id).split('').reduce(function(a,c){ return a+c.charCodeAt(0); }, 0);
  return parseFloat((3.8 + (seed % 12) / 10).toFixed(1));
}
function fakeReviews(id) {
  var seed = String(id).split('').reduce(function(a,c){ return a+c.charCodeAt(0); }, 0);
  return 18 + (seed % 120);
}

/* ── Product Card HTML ────────────────────────────────────── */
function renderProductCard(p, linkPrefix) {
  linkPrefix = linkPrefix || '';
  var price   = parsePrice(p.price);
  var img     = imgSrc(p.images && p.images[0]);
  var initial = getInitial(p.name);
  var rating  = fakeRating(p.id);
  var reviews = fakeReviews(p.id);
  var wished  = Wishlist.has(p.id);
  var detailUrl = linkPrefix + 'product-detail.html?id=' + p.id;

  return '<article class="product-card" data-id="' + p.id + '">' +
    '<div class="product-card-img-wrap">' +
      (p.tag ? '<span class="product-card-badge badge-new">' + p.tag + '</span>' : '') +
      '<button class="product-card-wishlist' + (wished ? ' active' : '') + '" onclick="toggleWishCard(this,\'' + p.id + '\')" aria-label="Yêu thích">' + (wished ? '♥' : '♡') + '</button>' +
      (img
        ? '<a href="' + detailUrl + '"><img class="product-card-img" src="' + img + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"/><div class="product-card-img-placeholder" style="display:none">' + initial + '</div></a>'
        : '<a href="' + detailUrl + '"><div class="product-card-img-placeholder">' + initial + '</div></a>') +
      '<div class="product-card-quick-add" onclick="quickAdd(\'' + p.id + '\')" role="button">+ Thêm vào giỏ</div>' +
    '</div>' +
    '<div class="product-card-body">' +
      '<div class="product-card-cat">' + p.category + '</div>' +
      '<h3 class="product-card-name"><a href="' + detailUrl + '">' + p.name + '</a></h3>' +
      '<div class="product-card-price"><span class="price-current">' + formatPrice(price) + '</span></div>' +
      '<div class="product-stars"><div class="stars-row" aria-label="' + rating + ' sao">' + renderStars(rating) + '</div><span class="stars-count">(' + reviews + ')</span></div>' +
    '</div>' +
  '</article>';
}

/* ── Quick add to cart ────────────────────────────────────── */
function quickAdd(productId) {
  var p = (VIORA_PRODUCTS || []).filter(function(x){ return String(x.id) === String(productId); })[0];
  if (!p) return;
  var size = p.sizes && p.sizes[0] ? p.sizes[0].split(/\s+/)[0] : '';
  Cart.add(p, size, 1);
  showToast('🛍️ Đã thêm "' + p.name + '" vào giỏ hàng', 'success');
  renderCartSidebar();
}

/* ── Toggle wishlist on card ──────────────────────────────── */
function toggleWishCard(btn, id) {
  var added = Wishlist.toggle(id);
  btn.innerHTML = added ? '♥' : '♡';
  btn.className = 'product-card-wishlist' + (added ? ' active' : '');
  showToast(added ? '❤️ Đã thêm vào yêu thích' : '🗑️ Đã xoá khỏi yêu thích', added ? 'success' : 'info');
}

/* ── Header scroll behavior ───────────────────────────────── */
function initHeader() {
  var hdr = document.getElementById('site-header');
  if (!hdr) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) { hdr.classList.add('scrolled'); }
    else                     { hdr.classList.remove('scrolled'); }
  }, { passive: true });

  // Mobile nav
  var hamburger = document.getElementById('hamburger');
  var mobNav    = document.getElementById('mob-nav');
  var mobOverlay= document.getElementById('mob-overlay');
  var mobClose  = document.getElementById('mob-close');

  function openMobile() {
    mobNav && mobNav.classList.add('open');
    mobOverlay && mobOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    mobNav && mobNav.classList.remove('open');
    mobOverlay && mobOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  hamburger  && hamburger.addEventListener('click', openMobile);
  mobClose   && mobClose.addEventListener('click', closeMobile);
  mobOverlay && mobOverlay.addEventListener('click', closeMobile);
  document.querySelectorAll('#mob-nav a').forEach(function(a){
    a.addEventListener('click', closeMobile);
  });

  // Cart badge
  Cart.updateBadge();

  // Cart open
  var cartBtn = document.getElementById('hdr-cart');
  cartBtn && cartBtn.addEventListener('click', openCartSidebar);

  // User button
  var userBtn = document.getElementById('hdr-user');
  userBtn && userBtn.addEventListener('click', function() {
    if (User.isLogged()) {
      if (confirm('Đăng xuất tài khoản "' + (User.get().name||'') + '"?')) {
        User.logout();
        updateUserDot();
        showToast('Đã đăng xuất', 'info');
      }
    } else {
      openLoginModal();
    }
  });

  // Search button
  var searchBtn = document.getElementById('hdr-search');
  searchBtn && searchBtn.addEventListener('click', function() {
    window.location.href = 'shop.html';
  });

  updateUserDot();
}

function updateUserDot() {
  var dot = document.getElementById('hdr-user-dot');
  if (dot) dot.style.display = User.isLogged() ? 'block' : 'none';
}

/* ── Cart Sidebar ─────────────────────────────────────────── */
function openCartSidebar() {
  var sb = document.getElementById('cart-sidebar');
  var ov = document.getElementById('cart-overlay');
  renderCartSidebar();
  sb && sb.classList.add('open');
  ov && ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCartSidebar() {
  var sb = document.getElementById('cart-sidebar');
  var ov = document.getElementById('cart-overlay');
  sb && sb.classList.remove('open');
  ov && ov.classList.remove('open');
  document.body.style.overflow = '';
}
function renderCartSidebar() {
  var list  = document.getElementById('cart-list');
  var foot  = document.getElementById('cart-footer-area');
  var countEl = document.getElementById('cart-item-count');
  if (!list) return;

  var items = Cart.getAll();
  var n     = Cart.count();
  if (countEl) countEl.textContent = n + ' sản phẩm';

  if (!items.length) {
    list.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><p class="cart-empty-text">Giỏ hàng đang trống</p><a href="shop.html" class="btn-ghost" style="text-decoration:none">Khám phá ngay →</a></div>';
    if (foot) foot.innerHTML = '';
    return;
  }

  list.innerHTML = items.map(function(item) {
    return '<div class="cart-item">' +
      '<div class="cart-item-img">' +
        (item.image ? '<img src="' + item.image + '" alt="' + item.name + '" onerror="this.outerHTML=\'<div class=placeholder-img>' + item.initial + '</div>\'">' : '<div class="placeholder-img">' + item.initial + '</div>') +
      '</div>' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        (item.size ? '<div class="cart-item-variant">Size: ' + item.size + '</div>' : '') +
        '<div class="cart-item-price-row">' +
          '<div class="cart-item-price">' + formatPrice(item.price * item.qty) + '</div>' +
          '<div style="display:flex;align-items:center;gap:.4rem">' +
            '<button class="qty-ctrl" onclick="cartQty(\'' + item.cartId + '\',-1)">−</button>' +
            '<span style="font-size:.8rem;font-weight:600;min-width:1rem;text-align:center">' + item.qty + '</span>' +
            '<button class="qty-ctrl" onclick="cartQty(\'' + item.cartId + '\',+1)">+</button>' +
            '<button class="cart-item-remove" onclick="cartRemove(\'' + item.cartId + '\')">Xoá</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  var total    = Cart.total();
  var freeShip = total >= 1500000;
  if (foot) {
    foot.innerHTML =
      '<div class="cart-subtotal"><span class="cart-subtotal-label">Tạm tính</span><span class="cart-subtotal-value">' + formatPrice(total) + '</span></div>' +
      '<p class="cart-shipping-note">' + (freeShip ? '✓ Được miễn phí vận chuyển!' : 'Mua thêm ' + formatPrice(1500000 - total) + ' để miễn phí ship') + '</p>' +
      '<button class="btn-checkout" onclick="window.location.href=\'checkout.html\'">Tiến Hành Thanh Toán</button>' +
      '<button class="btn-continue-shopping" onclick="closeCartSidebar()">Tiếp Tục Mua Sắm</button>';
  }
}
function cartQty(cartId, delta) {
  Cart.updateQty(cartId, delta);
  renderCartSidebar();
}
function cartRemove(cartId) {
  Cart.remove(cartId);
  renderCartSidebar();
}

/* ── Login Modal ──────────────────────────────────────────── */
function openLoginModal(tab) {
  var m = document.getElementById('modal-login');
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (tab) switchLoginTab(tab);
}
function closeLoginModal() {
  var m = document.getElementById('modal-login');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}
function switchLoginTab(tab) {
  document.querySelectorAll('.modal-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.modal-form-panel').forEach(function(p) {
    p.style.display = p.dataset.form === tab ? 'block' : 'none';
  });
}
function initLoginModal() {
  var m = document.getElementById('modal-login');
  if (!m) return;
  // Backdrop click
  m.addEventListener('click', function(e) {
    if (e.target === m) closeLoginModal();
  });
  // Tab switch
  m.querySelectorAll('.modal-tab').forEach(function(t) {
    t.addEventListener('click', function() { switchLoginTab(t.dataset.tab); });
  });
  // Switch tab links
  m.querySelectorAll('[data-switch-tab]').forEach(function(el) {
    el.addEventListener('click', function() { switchLoginTab(el.dataset.switchTab); });
  });
  // Password toggle
  m.querySelectorAll('.toggle-pass').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var inp = document.getElementById(btn.dataset.target);
      if (!inp) return;
      inp.type = inp.type === 'text' ? 'password' : 'text';
      btn.textContent = inp.type === 'text' ? '🙈' : '👁';
    });
  });
  // Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLoginModal();
  });
  // Login form
  var lf = document.getElementById('login-form');
  if (lf) lf.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value.trim();
    var pass  = document.getElementById('login-pass').value;
    if (!email || !pass) { showToast('Vui lòng nhập đầy đủ', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Email không hợp lệ', 'error'); return; }
    var btn = lf.querySelector('button[type="submit"] span');
    if (btn) btn.textContent = 'Đang xử lý...';
    setTimeout(function() {
      var name = email.split('@')[0];
      User.login({ email: email, name: name, avatar: name[0].toUpperCase() });
      showToast('✨ Chào mừng trở lại, ' + name + '!', 'success');
      closeLoginModal();
      updateUserDot();
      if (btn) btn.textContent = 'Đăng Nhập';
      lf.reset();
    }, 700);
  });
  // Register form
  var rf = document.getElementById('register-form');
  if (rf) rf.addEventListener('submit', function(e) {
    e.preventDefault();
    var name    = document.getElementById('reg-name').value.trim();
    var email   = document.getElementById('reg-email').value.trim();
    var pass    = document.getElementById('reg-pass').value;
    var confirm = document.getElementById('reg-confirm').value;
    if (!name || !email || !pass)                   { showToast('Vui lòng điền đầy đủ', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Email không hợp lệ', 'error'); return; }
    if (pass.length < 6)                            { showToast('Mật khẩu tối thiểu 6 ký tự', 'error'); return; }
    if (pass !== confirm)                           { showToast('Mật khẩu không khớp', 'error'); return; }
    var btn = rf.querySelector('button[type="submit"] span');
    if (btn) btn.textContent = 'Đang xử lý...';
    setTimeout(function() {
      User.login({ email: email, name: name, avatar: name[0].toUpperCase() });
      showToast('🎉 Chào mừng đến với VIORA, ' + name + '!', 'success');
      closeLoginModal();
      updateUserDot();
      if (btn) btn.textContent = 'Tạo Tài Khoản';
      rf.reset();
    }, 800);
  });
}

/* ── Scroll reveal ────────────────────────────────────────── */
function initReveal() {
  if (!window.IntersectionObserver) {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('revealed'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el, i) {
    el.style.transitionDelay = ((i % 4) * 0.07) + 's';
    obs.observe(el);
  });
}

/* ── Counter animation ────────────────────────────────────── */
function initCounters() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el  = entry.target;
      var max = parseInt(el.dataset.target, 10);
      var cur = 0;
      var step = Math.max(1, Math.ceil(max / 50));
      function tick() {
        cur = Math.min(cur + step, max);
        el.textContent = cur;
        if (cur < max) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(function(el) { obs.observe(el); });
}

/* ── Newsletter ───────────────────────────────────────────── */
function initNewsletter() {
  var form = document.getElementById('nl-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('nl-email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Vui lòng nhập email hợp lệ', 'error'); return;
    }
    var btn = document.getElementById('nl-btn');
    if (btn) { btn.textContent = '✓ Đã Đăng Ký'; btn.style.background = 'var(--primary-mid)'; }
    showToast('🎉 Đăng ký bản tin thành công!', 'success');
    document.getElementById('nl-email').value = '';
    setTimeout(function() {
      if (btn) { btn.textContent = 'Đăng Ký'; btn.style.background = ''; }
    }, 3000);
  });
}

/* ── Init on DOMContentLoaded ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initLoginModal();
  initReveal();
  initCounters();
  initNewsletter();
});
