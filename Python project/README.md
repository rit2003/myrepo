# E-commerce Backend API

A robust, secure, and maintainable backend RESTful API for an e-commerce platform built with FastAPI.

## Features

- **Authentication & Authorization**
  - User signup/signin with JWT tokens
  - Role-based access control (Admin/User)
  - Password reset functionality
  - Secure password hashing

- **Product Management**
  - Admin CRUD operations for products
  - Public product listing with filters and search
  - Pagination support
  - Stock management

- **Shopping Cart**
  - Add/remove/update cart items
  - Stock validation
  - User-specific cart management

- **Order Management**
  - Dummy checkout process
  - Order history and details
  - Order status tracking

## Tech Stack

- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Tokens for authentication
- **SQLite** - Database (easily replaceable with PostgreSQL)
- **Bcrypt** - Password hashing

## Project Structure

\`\`\`
app/
├── main.py                # FastAPI application entry point
├── auth/                  # Authentication module
│   ├── routes.py          # Auth endpoints
│   ├── models.py          # User and token models
│   ├── schemas.py         # Pydantic schemas
│   └── utils.py           # Auth utilities
├── products/              # Product management module
│   ├── routes.py          # Product endpoints
│   ├── models.py          # Product models
│   └── schemas.py         # Product schemas
├── cart/                  # Shopping cart module
│   ├── routes.py          # Cart endpoints
│   ├── models.py          # Cart models
│   └── schemas.py         # Cart schemas
├── orders/                # Order management module
│   ├── routes.py          # Order endpoints
│   ├── models.py          # Order models
│   └── schemas.py         # Order schemas
├── checkout/              # Checkout module
│   └── routes.py          # Checkout endpoints
├── core/                  # Core configuration
│   ├── config.py          # App configuration
│   └── database.py        # Database setup
├── utils/                 # Utility functions
│   └── auth.py            # Authentication utilities
├── middlewares/           # Custom middlewares
│   └── logging_middleware.py
└── scripts/               # Database scripts
    └── seed_data.py       # Sample data seeding
\`\`\`

## Installation & Setup

### 1. Clone and Setup Environment

\`\`\`bash
# Create project directory
mkdir ecommerce-backend
cd ecommerce-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Database
DATABASE_URL=sqlite:///./ecommerce.db

# JWT Settings
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email Settings (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
\`\`\`

### 3. Database Setup

\`\`\`bash
# Run the seed script to create tables and sample data
python scripts/seed_data.py
\`\`\`

This creates:
- Database tables
- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Sample products

### 4. Start the Application

\`\`\`bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

The API will be available at:
- **Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Admin Product Management
- `POST /admin/products` - Create product (Admin only)
- `GET /admin/products` - List all products with pagination (Admin only)
- `GET /admin/products/{id}` - Get product details (Admin only)
- `PUT /admin/products/{id}` - Update product (Admin only)
- `DELETE /admin/products/{id}` - Delete product (Admin only)

### Public Product APIs
- `GET /products` - List products with filters
- `GET /products/search` - Search products
- `GET /products/{id}` - Get product details

### Cart Management
- `POST /cart` - Add item to cart
- `GET /cart` - View cart
- `PUT /cart/{product_id}` - Update cart item quantity
- `DELETE /cart/{product_id}` - Remove item from cart

### Checkout & Orders
- `POST /checkout` - Process checkout (dummy payment)
- `GET /orders` - Get order history
- `GET /orders/{order_id}` - Get order details

## Testing with Postman

### 1. Authentication Flow

**Sign up:**
\`\`\`bash
POST http://localhost:8000/auth/signup
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
}
\`\`\`

**Sign in:**
\`\`\`bash
POST http://localhost:8000/auth/signin
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "user123"
}
\`\`\`

Save the `access_token` for subsequent requests.

### 2. Product Operations

**List products with filters:**
\`\`\`bash
GET http://localhost:8000/products?category=Electronics&min_price=100&max_price=1000
\`\`\`

**Search products:**
\`\`\`bash
GET http://localhost:8000/products/search?keyword=iPhone
\`\`\`

### 3. Cart Operations

**Add to cart:**
\`\`\`bash
POST http://localhost:8000/cart
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
    "product_id": 1,
    "quantity": 2
}
\`\`\`

**View cart:**
\`\`\`bash
GET http://localhost:8000/cart
Authorization: Bearer YOUR_ACCESS_TOKEN
\`\`\`

### 4. Checkout

**Process checkout:**
\`\`\`bash
POST http://localhost:8000/checkout
Authorization: Bearer YOUR_ACCESS_TOKEN
\`\`\`

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Access and refresh tokens
- **Role-Based Access Control**: Admin/User permissions
- **Input Validation**: Pydantic schemas for request validation
- **SQL Injection Protection**: SQLAlchemy ORM
- **CORS Protection**: Configurable CORS middleware

## Error Handling

All errors follow a consistent format:
\`\`\`json
{
    "error": true,
    "message": "Error description",
    "code": 400
}
\`\`\`

## Logging

The application logs:
- API access logs (IP, endpoint, method)
- Authentication attempts
- Errors and exceptions
- Performance metrics

## Production Deployment

### Environment Variables
- Change `SECRET_KEY` to a secure random string
- Use PostgreSQL: `DATABASE_URL=postgresql://user:pass@localhost/dbname`
- Configure SMTP for email functionality

### Server Configuration
\`\`\`bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
\`\`\`

### Database Migration
For production, consider using Alembic for database migrations:
\`\`\`bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
\`\`\`


