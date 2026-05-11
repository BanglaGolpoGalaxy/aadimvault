const Utils = {
    formatPrice: (val) => '₹' + Number(val).toFixed(2),
    getLang: () => document.body.getAttribute('data-lang') || 'en',
    setLang: (lang) => document.body.setAttribute('data-lang', lang),
    toggleTheme: () => {
        document.body.classList.toggle('dark');
        document.body.classList.toggle('light');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    }
};
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
} else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
}
