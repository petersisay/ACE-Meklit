# ✝️ Apostolic Church of Ethiopia (ACE) — ACE Meklit (MERN Stack)

A modern, responsive, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application built for the **Apostolic Church of Ethiopia (ACE)** and its faith apparel brand, **ACE Meklit**.

The application combines Christian values, anointed worship music, and apostolic preachings with a modern e-commerce storefront, user authentication, persistent shopping cart, and a full administrative management dashboard.

---

## 🌟 Key Features

### 🏠 Church Homepage & Scripture Focus
* **Hero Banner with Scripture Highlight:** Features Deuteronomy 6:4: *"Hear, O Israel: The LORD our GOD, The LORD is one."*
* **Ministry Pillars:** Explores purposeful faith style, anointed gospel songs, sound doctrine, and Christian integrity.
* **Featured Merchandise:** Dynamic showcase of ACE Meklit faith apparel and accessories with direct cart integration.
* **Media Highlights:** Embedded video players showcasing full gospel albums and apostolic sermons.

### 🛍️ ACE Meklit Online Store
* **Faith-Based Catalog:**
  * **ACE Logo Products:** Official hoodies, caps, winter jackets, ceramic tea mugs, t-shirts, and everyday shirts.
  * **Bible Verse Products:** Living Word hoodies (Acts 2:38), coffee cups (Isaiah 40:31), and scripture canvas tote bags (Joshua 1:9).
  * **Holy Bible Covers & Books:** Handcrafted leather Bible cases and *ቃሉ ይናገር (Kalu Ynager)* biblical doctrine books by Bishop Teklemariam Gezahagne.
* **Catalog Tools:** Live search filtering by title/scripture/keywords, category tabs, and price sorting (low-to-high, high-to-low, newest).
* **Product Detail Views:** Dedicated pages (`/product/:id`) with high-resolution imagery, scripture references, stock levels, quantity selectors, and related items.

### 🛒 Shopping Cart & Checkout
* **Persistent Cart:** Stored in `localStorage` across page reloads and browser sessions.
* **Cart Page (`/cart`):** Increment/decrement quantities, remove individual items, clear cart, and live total calculations.
* **Secure Checkout (`/checkout`):** Delivery details form, payment method selection (Telebirr, CBE Birr, Credit/Debit card simulation), real MongoDB order persistence, and confirmation tracking.

### 🎵 Anointed Gospel Music & Apostolic Preachings (`/media`)
* **Full Album Musics:** Stream full albums including *Hibret Zmare Senduk* (Eyesus Mulate), *Hibret Mezmur 17* (Anuregn), *Meseret Kejela Volume #1* (Alafrim), and *Apostolic Songs*.
* **Apostolic Sermons:** Life-changing preachings from Bishop Elias Asha (*Atcheneku*) and Bishop Degu Kebede (*Jmareyachinin Anirsa*).
* **Integrated YouTube Player:** Responsive 16:9 video embeds with direct YouTube links.

### ℹ️ About Us & Contact
* **About Page (`/about`):** Preserves authentic ACE Meklit heritage, brand purpose, craftsmanship, and commitment to scripture.
* **Interactive Contact Form (`/contact`):** Connected to MongoDB backend (`/api/contact`) with validation, feedback alerts, and church headquarters contact channels.

### 🔐 Authentication & Member Accounts
* **JWT Authentication:** Secure password hashing with `bcryptjs` and stateless JWT tokens.
* **Customer Dashboard (`/profile`):** View past orders, payment confirmations, and update profile details.
* **Instant Demo Logins:** One-click demo credentials helper on the login page for rapid testing.

### 🛡️ Administrative Dashboard (`/admin`)
* **Real-Time Metrics:** Total sales revenue, total order volume, catalog item count, and registered community members.
* **Product Management:** Add new merchandise, update pricing/stock, and remove products.
* **Order Management:** View all customer orders and update shipping statuses (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
* **Media Content Control:** Add and manage gospel albums and sermons with YouTube IDs.
* **Inquiry Management:** Review incoming messages, update resolution statuses (*unread*, *read*, *responded*), and delete spam.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router DOM 6, Axios, Lucide React, Custom CSS Design System |
| **Backend** | Node.js, Express.js, CORS, Morgan, dotenv |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Typography** | Cinzel (Majestic Serif) & Inter (Clean UI Sans) |

---

## 📂 Project Structure

```text
ACE-Meklit/
├── .gitignore                   # Git ignore for node_modules, .env, and build artifacts
├── package.json                 # Root unified workspace runner scripts
├── README.md                    # Project documentation
├── Images/                      # Original image assets and logos
│   ├── ace logo.jpg
│   ├── ace songs.png
│   ├── AS-banner.jpg
│   ├── bag.png
│   ├── Bible cover.jpg
│   ├── coffee_cup.png
│   ├── Facebook Logo.png
│   ├── hat.png
│   ├── hoddie.png
│   ├── jacket.png
│   ├── kalu ynager.jpg
│   ├── mug.png
│   ├── peter_hoddie.png
│   ├── shirt.png
│   ├── t-shirt.png
│   ├── telegram logo.png
│   ├── tiktok logo.png
│   └── youtube logo.png
├── server/                      # Express.js & MongoDB Backend
│   ├── .env.example             # Backend environment template
│   ├── package.json             # Server dependencies & scripts
│   ├── server.js                # Server entry point & API routes
│   ├── seeder.js                # Database seeder (products, media, demo accounts)
│   ├── config/
│   │   └── db.js                # MongoDB connection configuration with fallback
│   ├── models/
│   │   ├── User.js              # User model (bcrypt auth, roles)
│   │   ├── Product.js           # Merchandise model
│   │   ├── Order.js             # Order & shipping model
│   │   ├── MediaContent.js      # Music & sermon video model
│   │   └── ContactMessage.js    # Contact inquiry model
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── mediaController.js
│   │   └── contactController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── mediaRoutes.js
│   │   └── contactRoutes.js
│   └── middleware/
│       ├── authMiddleware.js    # JWT verification & admin guard
│       └── errorMiddleware.js   # 404 & central error handler
└── client/                      # React.js & Vite Frontend
    ├── package.json             # Frontend dependencies & build scripts
    ├── vite.config.js           # Vite dev proxy configuration
    ├── index.html               # Main HTML entry with Google fonts
    ├── public/
    │   └── Images/              # Client public static assets
    └── src/
        ├── main.jsx             # React DOM root with providers
        ├── App.jsx              # Main routing & layout structure
        ├── index.css            # Responsive CSS design system
        ├── services/
        │   └── api.js           # Axios instance with auth interceptors
        ├── context/
        │   ├── AuthContext.jsx  # Authentication state & login/register
        │   └── CartContext.jsx  # Persistent shopping cart state
        ├── components/
        │   ├── Navbar.jsx       # Header navigation & mobile menu
        │   ├── Footer.jsx       # Footer with scripture & social links
        │   ├── ProductCard.jsx  # Reusable merchandise card
        │   ├── MediaCard.jsx    # Responsive YouTube video card
        │   └── ProtectedRoute.jsx # Private & Admin route wrappers
        └── pages/
            ├── HomePage.jsx     # Church home overview
            ├── StorePage.jsx    # Product catalog with search & filters
            ├── ProductDetailPage.jsx # Individual product details
            ├── CartPage.jsx     # Shopping cart management
            ├── CheckoutPage.jsx # Multi-step checkout & payment
            ├── MediaPage.jsx    # Gospel songs & sermons library
            ├── AboutPage.jsx    # Ministry heritage & mission
            ├── ContactPage.jsx  # Inquiry submission form
            ├── LoginPage.jsx    # Login page with demo buttons
            ├── RegisterPage.jsx # New member registration
            ├── ProfilePage.jsx  # User account & order history
            └── AdminDashboardPage.jsx # Admin management portal
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
* **Node.js:** v18 or higher (v24+ supported)
* **npm:** v9 or higher
* **MongoDB:** A running local MongoDB instance (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

### 2. Clone Repository
```bash
git clone https://github.com/petersisay/ACE-Meklit.git
cd ACE-Meklit
```

### 3. Install Dependencies
Install all root, backend, and frontend dependencies in one command:
```bash
npm run install:all
```
*Or install individually:*
```bash
# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### 4. Configure Environment Variables
In the `server/` directory, create a `.env` file based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ace_meklit
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### 5. Seed the Database
Populate the database with the initial 11 products, 6 gospel albums & preachings, sample orders, and default users:
```bash
npm run seed
```
*(To destroy seeded data at any time, run: `npm run seed:destroy`)*

### 6. Run the Application

#### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
* Backend API will start on: **http://localhost:5000**
* Frontend application will start on: **http://localhost:5173**

#### Option B: Run Server and Client Separately
* Terminal 1 (Backend):
  ```bash
  npm run server
  ```
* Terminal 2 (Frontend):
  ```bash
  npm run client
  ```

---

## 👥 Default Demo & Admin Accounts

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@acemeklit.org` | `password123` | Full Admin Privileges |
| **Member / Customer** | `bereket@example.com` | `password123` | Customer / Buyer |

*(You can also click the quick **Demo Admin** or **Demo Customer** buttons directly on the Login page!)*

---

## 📡 API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new member
* `POST /api/auth/login` — Sign in and obtain JWT
* `GET /api/auth/profile` — Get logged-in user profile (Private)
* `PUT /api/auth/profile` — Update user profile details (Private)
* `GET /api/auth/users` — List all registered members (Admin)

### Products (`/api/products`)
* `GET /api/products` — Fetch products (supports `?category=`, `?keyword=`, `?sort=`)
* `GET /api/products/:id` — Get single product details
* `GET /api/products/categories/list` — List all unique categories
* `POST /api/products` — Create new product (Admin)
* `PUT /api/products/:id` — Update product (Admin)
* `DELETE /api/products/:id` — Remove product (Admin)

### Orders (`/api/orders`)
* `POST /api/orders` — Create new purchase order (Private)
* `GET /api/orders/myorders` — List current user's orders (Private)
* `GET /api/orders/:id` — Get specific order details (Private)
* `PUT /api/orders/:id/pay` — Record simulated payment (Private)
* `GET /api/orders` — List all orders across users (Admin)
* `PUT /api/orders/:id/status` — Update order delivery status (Admin)

### Gospel Media (`/api/media`)
* `GET /api/media` — Fetch media items (supports `?type=music|preaching`, `?featured=true`)
* `GET /api/media/:id` — Get media item by ID
* `POST /api/media` — Publish new video/album embed (Admin)
* `PUT /api/media/:id` — Update media item (Admin)
* `DELETE /api/media/:id` — Remove media item (Admin)

### Contact (`/api/contact`)
* `POST /api/contact` — Submit inquiry message (Public)
* `GET /api/contact` — View all messages (Admin)
* `PUT /api/contact/:id` — Update status (*unread*, *read*, *responded*) (Admin)
* `DELETE /api/contact/:id` — Remove message (Admin)

---

## 🚀 Building for Production

To build the optimized client bundle for deployment:
```bash
npm run build
```
The compiled assets will be output to `client/dist/`. The Express backend is pre-configured to automatically serve `client/dist` in production mode.

---

## 👤 Author

**Petros Sisay**  
Web Developer & Software Engineer  
Apostolic Church of Ethiopia Project

---

## 📜 License

This project is created for educational, ministry, and portfolio demonstration purposes.  
All rights reserved © 2026.
