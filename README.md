# NeuralShop - Lab 3 Submission

**NeuralShop** is a premium e-commerce platform for AI tools and game services, built with Next.js, Tailwind CSS, and ShadCN UI.

## 🚀 Features (Lab 3 Implemented)

- **🛒 Shopping Cart System**:
  - Add products to cart with quantity management.
  - Persistent storage using `localStorage` (Cart saved on reload).
  - Real-time cart badge update in Navbar.
- **🖼️ Product Display**:
  - Grid view of products with images, names, and prices (VND).
  - Filter by category (AI Tools, Game Services, Social Media) and price range.
  - Search functionality with URL synchronization.
- **💰 Checkout & Calculations**:
  - Dynamic subtotal and total calculation.
  - Formatted currency (e.g., `50.000 ₫`).
- **📱 Responsive Design**: optimized for mobile and desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏃‍♂️ How to Run Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/phamngophat/Neural-v2.Shop.git
    cd NeuralShop-main
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```
app/
├── cart/           # Cart Page
├── login/          # Login Page
├── register/       # Register Page
└── page.tsx        # Home Page (Product List)
components/
├── CartIcon.tsx    # Cart Badge & Logic
├── CartItem.tsx    # Individual Cart Item
├── Navbar.tsx      # Navigation & Search
├── ProductCard.tsx # Product Display Card
└── SearchInput.tsx # Search Logic (Suspense wrapped)
lib/
├── cart.ts         # Cart Business Logic
├── products.ts     # Mock Data
└── utils.ts        # Helper functions (Currency formatter)
```

## 📝 Lab Report

Please verify the deployment on Vercel.

---
*Student: [Your Name]*
*Class: [Your Class]*
