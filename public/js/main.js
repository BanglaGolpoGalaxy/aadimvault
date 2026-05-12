'use strict';
console.log('Adim Vault Loaded');

// ---------- API Base URL ----------
const API_BASE = '/api';

// ---------- Theme Toggle ----------
function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    const btn = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark')) {
        btn.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        btn.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme on startup
(function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.innerHTML = '☀️';
    }
})();

// ---------- Load Products from API ----------
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = '<p style="text-align:center;width:100%;">Loading products...</p>';

    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const products = await res.json();

        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align:center;width:100%;">কোন প্রোডাক্ট পাওয়া যায়নি।</p>';
            return;
        }

        grid.innerHTML = products.map(p => {
            const image = p.image ? `<img src="${p.image}" alt="${p.title}" class="product-img">` : '<div class="card-img">🏺</div>';
            const price = p.for_sale ? `<span class="product-price">₹${Number(p.price).toFixed(2)}</span>` : '';
            const story = p.story_local || p.story_en || p.description || 'No story available.';
            const auctionBadge = p.auction ? '<span class="badge auction">নিলাম চলছে</span>' : '';
            const saleBadge = p.for_sale ? '<span class="badge sale">বিক্রি</span>' : '';
            const displayBadge = p.display_only ? '<span class="badge display">শুধু প্রদর্শন</span>' : '';

            return `
                <article class="product-card">
                    ${image}
                    <div class="card-badges">${auctionBadge}${saleBadge}${displayBadge}</div>
                    <h3>${p.title}</h3>
                    <p class="card-story">${story.slice(0, 100)}${story.length > 100 ? '...' : ''}</p>
                    ${price}
                    <a href="product.html?id=${p.id}" class="btn btn-small">বিস্তারিত</a>
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading products:', err);
        grid.innerHTML = '<p style="text-align:center;width:100%;color:red;">প্রোডাক্ট লোড করতে সমস্যা হয়েছে।</p>';
    }
}

// ---------- Start on page load ----------
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
