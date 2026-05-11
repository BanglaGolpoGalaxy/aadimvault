# আদিম ভল্ট (AadimVault) — ফেজ-১ ব্লুপ্রিন্ট ও রোডম্যাপ

## ১. প্রোজেক্ট সংক্ষেপ
**আদিম ভল্ট** একটি মোবাইল-প্রথম, বিশ্বজনীন ভার্চুয়াল ভাণ্ডার ও ইতিহাস প্রদর্শনী প্ল্যাটফর্ম। এখানে সংগ্রাহক ও সাধারণ মানুষ তাদের পুরনো জিনিস ও স্মৃতিচিহ্ন গল্পসহ সংরক্ষণ করতে পারে, বিক্রি করতে পারে, কিংবা নিলামে তুলতে পারে। দর্শনার্থীরা এই রহস্যময় ভল্টে প্রবেশ করে আবিষ্কার করবে পৃথিবীর নানা প্রান্তের ইতিহাস।

**মূল ফিচার (ফেজ-১):**
- পণ্য আপলোড (ছবি, গল্প, বিক্রি/প্রদর্শনী)
- কেনাকাটা ও নিলাম
- প্রদর্শনী (ক্রয় বাধ্যতামূলক নয়)
- প্রতিটি পণ্যের পেছনে সমৃদ্ধ গল্প

## ২. ভিশন (তিন ফেজ)
- **ফেজ-১ (বর্তমান):** সরল ই-কমার্স + নিলাম + প্রদর্শনী + গল্প
- **ফেজ-২ (ভবিষ্যৎ):** গ্যামিফিকেশন, নিজস্ব জাদুঘর
- **ফেজ-৩ (ভবিষ্যৎ):** ভার্চুয়াল ওয়ার্ল্ড, জমি-বাড়ি, ঘুরে দেখা

## ৩. টেকনিক্যাল আর্কিটেকচার (হাইব্রিড)[ব্যবহারকারী] ⇄ [GitHub Pages (স্ট্যাটিক ফ্রন্টএন্ড)]
↕ (fetch API, HTTPS)
[Cloudflare Tunnel]
↕
[Termux → Express.js (REST API)]
↕
[SQLite (sql.js)]
- ফ্রন্টএন্ড: HTML + CSS + Vanilla JS (কোনো ফ্রেমওয়ার্ক নেই)
- ব্যাকএন্ড: Node.js + Express.js (Termux-এ লোকাল, টানেল দিয়ে পাবলিক)
- ডাটাবেস: SQLite (sql.js, ফাইল-বেজড)
- ছবি স্টোরেজ: `/uploads` ফোল্ডার (স্ট্যাটিক ফাইল হিসেবে সার্ভ)

## ৪. ফোল্ডার স্ট্রাকচারaadimvault/
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
├── database/db.js
├── middleware/auth.js
├── routes/auth.js
├── routes/products.js
├── uploads/
└── public/
├── index.html
├── login.html
├── upload.html
├── product.html
├── cart.html
├── css/style.css
├── js/main.js
├── js/auth.js
├── js/products.js
└── js/utils.js
## ৫. ডাটাবেস স্কিমা

### users
| কলাম | টাইপ | বিবরণ |
|------|------|--------|
| id | INTEGER PK | |
| name | TEXT | |
| email | TEXT UNIQUE | |
| password | TEXT | bcrypt hash |
| role | TEXT | 'user' / 'admin' |
| created_at | TEXT | datetime |

### products
| কলাম | টাইপ | বিবরণ |
|------|------|--------|
| id | INTEGER PK | |
| user_id | INTEGER FK | users.id |
| title | TEXT | |
| description | TEXT | |
| price | REAL | |
| for_sale | INTEGER | 1=বিক্রি 0=না |
| display_only | INTEGER | 1=শুধু প্রদর্শনী |
| auction | INTEGER | 1=নিলাম চলছে 0=না |
| image | TEXT | /uploads/... |
| story_en | TEXT | ইংরেজি গল্প |
| story_local | TEXT | স্থানীয় ভাষার গল্প |
| local_lang | TEXT | ভাষার কোড (bn, en, ja...) |
| created_at | TEXT | |

### bids (নিলাম)
| কলাম | টাইপ | বিবরণ |
|------|------|--------|
| id | INTEGER PK | |
| product_id | INTEGER FK | products.id |
| user_id | INTEGER FK | users.id |
| amount | REAL | |
| bid_at | TEXT | datetime |

## ৬. API এন্ডপয়েন্ট (REST)
| মেথড | রাউট | অথ | বিবরণ |
|------|------|-----|--------|
| POST | /api/auth/register | পাবলিক | রেজিস্টার |
| POST | /api/auth/login | পাবলিক | লগইন (JWT) |
| GET | /api/products | পাবলিক | সব পণ্য |
| GET | /api/products/:id | পাবলিক | সিঙ্গেল পণ্য |
| POST | /api/products | JWT | নতুন পণ্য (multipart) |
| PUT | /api/products/:id | JWT (owner/admin) | পণ্য এডিট |
| DELETE | /api/products/:id | JWT (owner/admin) | পণ্য ডিলিট |
| POST | /api/products/:id/bid | JWT | নিলামে ডাক |
| GET | /api/products/:id/bids | পাবলিক | নিলামের তালিকা |

## ৭. ফ্রন্টএন্ড পেইজ ও কম্পোনেন্ট
### পেইজ:
1. `index.html` — হোম, প্রোডাক্ট গ্রিড, ফিল্টার (বিক্রি/প্রদর্শনী/নিলাম)
2. `login.html` — লগইন/রেজিস্টার
3. `upload.html` — প্রোডাক্ট যোগ/এডিট ফর্ম (লগইন)
4. `product.html?id=...` — বিস্তারিত (গ্রাফ, গল্প, বিড, কিনুন)
5. `cart.html` — লোকাল কার্ট

### JS মডিউল:
- `api.js` — বেজ URL, fetch র‍্যাপার
- `auth.js` — টোকেন ম্যানেজমেন্ট
- `products.js` — প্রোডাক্ট রেন্ডার
- `utils.js` — ডার্ক মোড, ভাষা টগল, ফরম্যাট

### থিমিং:
- CSS কাস্টম প্রপার্টি (--bg, --text, --primary, --accent)
- `.dark` / `.light` ক্লাস টগল
- ভাষা: `data-lang="bn"` / `"en"`

## ৮. ডেভেলপমেন্ট রোডম্যাপ (৫ স্প্রিন্ট)

### 🟢 স্প্রিন্ট ১ — ফাউন্ডেশন (সপ্তাহ ১)
- [x] রিপো ও ব্লুপ্রিন্ট
- [ ] database/db.js — sql.js সেটআপ
- [ ] auth রাউট + JWT
- [ ] auth মিডলওয়্যার

### 🟡 স্প্রিন্ট ২ — প্রোডাক্ট API (সপ্তাহ ২)
- [ ] Multer ইমেজ আপলোড
- [ ] products রাউট (CRUD)
- [ ] বিডিং রাউট

### 🟠 স্প্রিন্ট ৩ — ফ্রন্টএন্ড (সপ্তাহ ৩)
- [ ] index.html + প্রোডাক্ট গ্রিড
- [ ] login.html + auth.js
- [ ] upload.html + মাল্টিপার্ট ফর্ম
- [ ] product.html + বিডিং UI

### 🔵 স্প্রিন্ট ৪ — UX (সপ্তাহ ৪)
- [ ] ডার্ক/লাইট মোড
- [ ] ভাষা টগল
- [ ] লোকাল কার্ট

### 🟣 স্প্রিন্ট ৫ — ডেপ্লয়মেন্ট (সপ্তাহ ৫)
- [ ] GitHub Actions → GitHub Pages
- [ ] Cloudflare Tunnel (Termux)
- [ ] SEO, Analytics

## ৯. ডেপ্লয়মেন্ট স্ট্র্যাটেজি
- **ফ্রন্টএন্ড:** GitHub Actions দিয়ে `public/` → GitHub Pages
- **ব্যাকএন্ড:** Termux-এ `node server.js` + `cloudflared tunnel`
- **API URL:** টানেলের টেম্পোরারি URL (স্থায়ী ডোমেইন পরে)

---

> “আদিম ভল্ট — যেখানে গল্প আগলে রাখে সময়।”
