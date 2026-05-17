'use strict';

const API = '/api';

// ---------- DOM Elements ----------
const themeToggleBtn = document.getElementById('themeToggleItem');
const langToggleBtn = document.getElementById('langToggleItem');
const themeIcon = document.getElementById('themeIcon');
const exploreBtn = document.getElementById('exploreBtn');
const profileTrigger = document.getElementById('profileTrigger');

// ---------- State ----------
let currentLang = localStorage.getItem('aadimvault-lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'light';

// ---------- Apply Initial Theme ----------
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
}
applyTheme(currentTheme);

// ---------- Theme Toggle ----------
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

// ---------- Apply Initial Language ----------
function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('aadimvault-lang', lang);
    
    document.querySelectorAll('[data-en][data-bn]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    
    if (langToggleBtn) {
        langToggleBtn.innerHTML = lang === 'en' ? '<span>বাংলা</span>' : '<span>English</span>';
    }
}
applyLang(currentLang);

// ---------- Language Toggle ----------
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'bn' : 'en';
        applyLang(newLang);
    });
}

// ---------- Profile Redirect ----------
if (profileTrigger) {
    profileTrigger.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// ---------- Explore Button ----------
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        const target = document.getElementById('market');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
}

// ---------- Auth Nav Update ----------
function updateAuthUI() {
    // Will be used when login/logout state changes
}

// ---------- Load API Data ----------
async function loadProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    try {
        const res = await fetch(`${API}/products`);
        const products = await res.json();
        grid.innerHTML = products.length ? products.map(p => `
            <div class="product-card">
                ${p.image ? `<img src="${p.image}" alt="${p.title}">` : '<div style="height:260px;background:var(--card);display:flex;align-items:center;justify-content:center;font-size:3rem;">🏺</div>'}
                <div class="card-content">
                    <h3>${p.title}</h3>
                    <p>₹ ${Number(p.price).toFixed(2)}</p>
                    <a href="product.html?id=${p.id}" class="primary-btn small" data-en="Details" data-bn="বিস্তারিত">Details</a>
                </div>
            </div>
        `).join('') : '<p>No products yet.</p>';
        applyLang(currentLang);
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p>Failed to load products.</p>';
    }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadProducts();
});
