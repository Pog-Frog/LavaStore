# LavaStore - Organic Food E-commerce Platform

LavaStore is a modern full-stack e-commerce application focused on selling organic, nutritionally complete food products. The platform features a user-friendly storefront for customers and a comprehensive admin panel for store management.

## 🌟 Features

### Customer Features
- **Product Browsing & Filtering**: Intuitive interface to browse products with category and price filters.
- **User Authentication**: Secure registration, login, and profile management.
- **Shopping Cart**: Add products to cart, update quantities, and remove items.
- **Checkout Process**: Streamlined checkout with shipping and payment information.
- **Order History**: View past orders and their statuses.
- **Responsive Design**: Optimized for a seamless experience on mobile, tablet, and desktop.
- **Product Details**: View detailed information about each product.
- **About Us Page**: Learn more about LavaStore's mission and values.

### Admin Features
- **Admin Dashboard**: Overview of key metrics like total revenue, orders, and sales.
- **Product Management**: Create, read, update, and delete products, including details like name, description, price, category, images, and dietary preferences.
- **Order Management**: View and manage customer orders, update order statuses.
- **Category Management**: (Implied) Ability to manage product categories.
- **User Management**: (Implied) Ability to view and manage users.
- **Secure Admin Panel**: Role-based access control for admin functionalities.


- **Frontend**: Angular (v19), TailwindCSS
- **Backend**: Laravel PHP Framework, providing a RESTful API.
- **Database**: MySQL (inferred from typical Laravel setups and previous README drafts).
- **Authentication**: JWT token-based authentication (common for Laravel APIs).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js and npm**: For Angular frontend (Node.js v18+ recommended).
- **Angular CLI**: `npm install -g @angular/cli`
- **PHP**: For Laravel backend (PHP v8.1+ recommended).
- **Composer**: For PHP dependency management.
- **MySQL**: Or another compatible database supported by Laravel.
- **Git**: For version control.

## 🚀 Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <your-repository-url> LavaStore
cd LavaStore
```

### 2. Backend Setup (`lavastore_backend`)

1.  **Navigate to the backend directory:**
    ```bash
    cd lavastore_backend
    ```
2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```
3.  **Create and configure the environment file:**
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Generate an application key:
    ```bash
    php artisan key:generate
    ```
    Update your `.env` file with your database credentials (DB_DATABASE, DB_USERNAME, DB_PASSWORD) and other necessary configurations.
    ```env
    APP_NAME=LavaStore
    APP_ENV=local
    APP_KEY=base64:...
    APP_DEBUG=true
    APP_URL=http://localhost:8000

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=lavastore
    DB_USERNAME=root
    DB_PASSWORD=

    # For Sanctum (if used for API authentication)
    SANCTUM_STATEFUL_DOMAINS=localhost:4200
    SESSION_DOMAIN=localhost
    ```
4.  **Run database migrations and seeders:**
    (Ensure your database is created and accessible)
    ```bash
    php artisan migrate --seed
    ```
    This will create the necessary tables (users, products, categories, orders, etc.) and populate them with initial data if seeders are configured.
5.  **Start the Laravel development server:**
    ```bash
    php artisan serve
    ```
    The backend API will typically be available at `http://localhost:8000`.

### 3. Frontend Setup (`lavastore_frontend`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../lavastore_frontend 
    ```
    (If you are in `lavastore_backend`, otherwise `cd lavastore_frontend` from the project root)
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    The frontend likely connects to the backend API. Configure the API URL in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

    *Example for `src/environments/environment.ts` (development):*
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:8000/api', // Your Laravel API endpoint
      storageUrl: 'http://localhost:8000/storage/' // For accessing stored files like images
    };
    ```
    *Example for `src/environments/environment.prod.ts` (production):*
    ```typescript
    export const environment = {
      production: true,
      apiUrl: 'https://your-production-api-domain.com/api',
      storageUrl: 'https://your-production-api-domain.com/storage/'
    };
    ```
4.  **Start the Angular development server:**
    ```bash
    ng serve
    ```
    The frontend application will typically be available at `http://localhost:4200/`.

## 📝 Usage

-   **Customer Storefront**: Access at `http://localhost:4200/`.
-   **Admin Panel**: Typically accessed via a specific route like `http://localhost:4200/admin/dashboard` after logging in with admin credentials.

### Default Credentials (if seeded)
-   **Admin**:
    -   Email: `admin@example.com`
    -   Password: `password` (or as defined in your `UserSeeder`)
-   **Customer**:
    -   Email: `customer@example.com`
    -   Password: `password` (or as defined in your `UserSeeder`)

## 📊 Project Structure

```
LavaStore/
├── lavastore_backend/       # Laravel Backend Application
│   ├── app/                 # Core application code (Controllers, Models, Services)
│   ├── config/              # Configuration files
│   ├── database/            # Migrations, Seeders, Factories
│   ├── public/              # Public assets, index.php
│   ├── resources/           # Views (primarily for API resources), lang files
│   ├── routes/              # API and web routes (api.php)
│   ├── storage/             # App storage (logs, file uploads)
│   ├── tests/               # PHPUnit tests
│   ├── .env.example         # Environment configuration template
│   ├── artisan              # Laravel CLI tool
│   └── composer.json        # PHP dependencies
│
└── lavastore_frontend/      # Angular Frontend Application
    ├── src/
    │   ├── app/             # Core application modules, components, services
    │   │   ├── admin/       # Admin panel specific features
    │   │   ├── auth/        # Authentication components (login, register)
    │   │   ├── components/  # Shared UI components
    │   │   ├── guards/      # Route guards
    │   │   ├── layouts/     # Layout components (Home, Admin, Auth)
    │   │   ├── models/      # TypeScript interfaces for data structures
    │   │   └── services/    # Angular services (API calls, state management)
    │   ├── assets/          # Static assets (images, fonts)
    │   ├── environments/    # Environment configuration files
    │   ├── index.html       # Main HTML page
    │   └── main.ts          # Main entry point for the Angular app
    ├── angular.json         # Angular CLI project configuration
    ├── package.json         # Node.js dependencies and scripts
    └── tailwind.config.js   # TailwindCSS configuration
```

## 🧪 Testing

### Frontend (Angular)

Navigate to the `lavastore_frontend` directory:
```bash
cd lavastore_frontend
npm test  # or ng test (runs unit tests with Karma)
# For e2e tests, ensure a framework like Cypress or Protractor is set up.
# ng e2e
```

### Backend (Laravel)

Navigate to the `lavastore_backend` directory:
```bash
cd lavastore_backend
php artisan test # Runs PHPUnit tests
```
