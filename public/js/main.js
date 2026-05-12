'use strict';
console.log('Adim Vault Loaded');

const API_BASE = '/api';

// ---------- Theme ----------
function toggleTheme() {
    document.body.classList.toggle('dark'); document.body.classList.toggle('light');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}
(function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark'); document.body.classList.remove('light');
        const btn = document.getElementById('theme-toggle'); if (btn) btn.innerHTML = '☀️';
    }
})();

// ---------- Language ----------
function switchLanguage(lang) {
    document.body.setAttribute('data-lang', lang);
    localStorage.setItem('language', lang);
    // পরে আরও গভীর অনুবাদ যোগ হবে
}

// ---------- Search ----------
function handleSearch(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        // আপাতত ক্যাটাগরি ফিল্টার, পরে API সার্চ হবে
        window.location.href = `product.html?search=${encodeURIComponent(query)}`;
    }
}

// ---------- Nav ----------
function updateNav() {
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;
    if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
        const user = Auth.getUser();
        authArea.innerHTML = `<span style="margin-right:8px;"><i class="fas fa-user"></i> ${user.name || 'User'}</span> <a href="#" onclick="Auth.logout();return false;"><i class="fas fa-sign-out-alt"></i> লগআউট</a>`;
    } else {
        authArea.innerHTML = '<a href="login.html"><i class="fas fa-user"></i> লগইন</a>';
    }
}

// ---------- Load Products ----------
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '<p style="text-align:center;">Loading...</p>';
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed');
        const products = await res.json();
        if (!products.length) { grid.innerHTML = '<p style="text-align:center;">কোনো প্রোডাক্ট নেই।</p>'; return; }
        grid.innerHTML = products.slice(0, 10).map(p => {
            const img = p.image ? `<img src="${p.image}" alt="${p.title}" class="product-img">` : '<div class="card-img">🏺</div>';
            const price = p.for_sale ? `<span class="product-price">₹${Number(p.price).toFixed(2)}</span>` : '';
            const story = (p.story_local || p.story_en || p.description || '').slice(0, 100);
            return `<article class="product-card">${img}<div class="card-badges">${p.auction?'<span class="badge auction">নিলাম</span>':''}${p.for_sale?'<span class="badge sale">বিক্রি</span>':''}${p.display_only?'<span class="badge display">প্রদর্শন</span>':''}</div><h3>${p.title}</h3><p class="card-story">${story}${story.length>=100?'...':''}</p>${price}<a href="product.html?id=${p.id}" class="btn btn-small">বিস্তারিত</a></article>`;
        }).join('');
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="text-align:center;color:red;">লোড করতে সমস্যা হয়েছে।</p>';
    }
}

// ---------- টাইমার ----------
function updateTimers() {
    document.querySelectorAll('.auction-timer[data-end]').forEach(el => {
        const end = new Date(el.getAttribute('data-end')).getTime();
        const now = Date.now();
        const diff = end - now;
        if (diff <= 0) { el.innerHTML = '<i class="fas fa-times-circle"></i> শেষ'; return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        el.innerHTML = `<i class="fas fa-hourglass-half"></i> ${d}দিন ${h}ঘণ্টা ${m}মিনিট`;
    });
}
setInterval(updateTimers, 60000);
updateTimers();

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateNav();
});
