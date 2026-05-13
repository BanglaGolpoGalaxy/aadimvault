'use strict';
// Check admin access – if not admin, redirect
(async function() {
    if (!Auth.isLoggedIn()) { window.location.href = 'login.html'; return; }
    const user = Auth.getUser();
    if (user.role !== 'admin') {
        alert('এই পৃষ্ঠা শুধু অ্যাডমিনের জন্য।');
        window.location.href = 'index.html';
        return;
    }
    loadStats();
    loadUsers();
})();

async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats', { headers: authHeaders() });
        if (!res.ok) throw new Error('Failed');
        const stats = await res.json();
        const cards = document.querySelectorAll('.stat-card h3');
        if (cards.length >= 3) {
            cards[0].textContent = stats.totalUsers || 0;
            cards[1].textContent = stats.totalProducts || 0;
            cards[2].textContent = stats.totalBids || 0;
        }
    } catch (err) {
        console.error('Stats error:', err);
    }
}

async function loadUsers() {
    const tbody = document.getElementById('user-table-body');
    try {
        const res = await fetch('/api/admin/users', { headers: authHeaders() });
        if (!res.ok) throw new Error('Failed');
        const users = await res.json();
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}">${u.role}</span></td>
                <td>
                    ${u.role !== 'admin' ? `<button class="btn-change" onclick="promoteToAdmin(${u.id})">Make Admin</button>` : ''}
                    ${u.role === 'admin' ? `<button class="btn-change" style="background:#c0392b;" onclick="demoteToUser(${u.id})">Make User</button>` : ''}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="4">ডেটা লোড করতে ব্যর্থ।</td></tr>';
    }
}

function authHeaders() {
    return { 'Authorization': `Bearer ${Auth.getToken()}` };
}

async function promoteToAdmin(id) {
    if (!confirm('এই ইউজারকে অ্যাডমিন করতে নিশ্চিত?')) return;
    await updateRole(id, 'admin');
    loadUsers();
}

async function demoteToUser(id) {
    if (!confirm('এই ইউজারকে সাধারণ ইউজারে নামাতে নিশ্চিত?')) return;
    await updateRole(id, 'user');
    loadUsers();
}

async function updateRole(id, role) {
    try {
        const res = await fetch(`/api/admin/users/${id}/role`, {
            method: 'PUT',
            headers: { ...authHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ role })
        });
        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Failed');
        } else {
            alert('রোল আপডেট সফল!');
        }
    } catch (err) {
        alert('নেটওয়ার্ক সমস্যা।');
    }
}
