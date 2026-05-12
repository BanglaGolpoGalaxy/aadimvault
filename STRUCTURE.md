# আদিম ভল্ট — প্রোজেক্ট স্ট্রাকচার

## 🌳 ফাইল ট্রিaadimvault/
├── .env
├── .env.example
├── .gitignore
├── BLUEPRINT.md
├── LICENSE
├── README.md
├── package.json
├── server.js
│
├── database/
│   └── db.js
│
├── middleware/
│   └── auth.js
│
├── routes/
│   ├── auth.js
│   └── products.js
│
├── uploads/
│   └── .gitkeep
│
└── public/
    ├── index.html
    ├── login.html
    ├── upload.html
    ├── product.html
    ├── cart.html
    │
    ├── css/
    │   └── style.css
    │
    ├── js/
    │   ├── main.js
    │   ├── auth.js
    │   ├── products.js
    │   └── utils.js
    │
    ├── images/
    │   └── .gitkeep
    │
    └── blog/
        └── episode-01.html
        ## 📊 ফাইলের অবস্থা (শেষ আপডেট: ১২ মে ২০২৬)
        
        | ফাইল | অবস্থা | স্প্রিন্ট |
        |-------|--------|:----------:|
        | `server.js` | ✅ রাউট অ্যাক্টিভ | ১ |
        | `database/db.js` | ✅ টেবিল তৈরি (users, products, bids) | ১ |
        | `middleware/auth.js` | ✅ JWT ভেরিফিকেশন | ১ |
        | `routes/auth.js` | ✅ register + login | ১ |
        | `routes/products.js` | 🔜 স্কেলিটন (ফাঁকা) | ২ |
        | `public/index.html` | ✅ পূর্ণাঙ্গ হিরো + কার্ড | ১ |
        | `public/css/style.css` | ✅ ডার্ক/লাইট + নেভিগেশন | ১ |
        | `public/js/main.js` | ✅ থিম টগল | ১ |
        | `public/js/utils.js` | ✅ ফরম্যাটিং ফাংশন | ১ |
        | `public/js/auth.js` | 🔜 শুধু `'use strict'` | ৩ |
        | `public/js/products.js` | 🔜 শুধু `'use strict'` | ৩ |
        | `public/login.html` | 🔜 শুধু বেস কাঠামো | ৩ |
        | `public/upload.html` | 🔜 শুধু বেস কাঠামো | ৩ |
        | `public/product.html` | 🔜 শুধু বেস কাঠামো | ৩ |
        | `public/cart.html` | 🔜 শুধু বেস কাঠামো | ৪ |
        
        > ✅ = সম্পূর্ণ | 🔜 = আসন্ন | ❌ = শুরু হয়নি
