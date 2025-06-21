import sys
import os

# Add the parent directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from core.database import engine, SessionLocal, Base
from auth.models import User, UserRole
from products.models import Product
from auth.utils import hash_password

def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        raise

def seed_users(db: Session):
    """Create sample users"""
    try:
        # Check if users already exist
        if db.query(User).first():
            print("⚠️  Users already exist, skipping user creation")
            return
        
        users = [
            {
                "name": "Admin User",
                "email": "admin@example.com",
                "password": "admin123",
                "role": UserRole.ADMIN
            },
            {
                "name": "Regular User",
                "email": "user@example.com", 
                "password": "user123",
                "role": UserRole.USER
            }
        ]
        
        for user_data in users:
            user = User(
                name=user_data["name"],
                email=user_data["email"],
                hashed_password=hash_password(user_data["password"]),
                role=user_data["role"]
            )
            db.add(user)
        
        db.commit()
        print("✅ Sample users created")
        print("   Admin: admin@example.com / admin123")
        print("   User: user@example.com / user123")
        
    except Exception as e:
        print(f"❌ Error creating users: {str(e)}")
        db.rollback()
        raise

def seed_products(db: Session):
    """Create sample products"""
    try:
        # Check if products already exist
        if db.query(Product).first():
            print("⚠️  Products already exist, skipping product creation")
            return
        
        products = [
            {
                "name": "iPhone 15 Pro",
                "description": "Latest iPhone with advanced camera system",
                "price": 999.99,
                "stock": 50,
                "category": "Electronics",
                "image_url": "https://example.com/iphone15.jpg"
            },
            {
                "name": "MacBook Air M2",
                "description": "Lightweight laptop with M2 chip",
                "price": 1199.99,
                "stock": 30,
                "category": "Electronics",
                "image_url": "https://example.com/macbook.jpg"
            },
            {
                "name": "Nike Air Max",
                "description": "Comfortable running shoes",
                "price": 129.99,
                "stock": 100,
                "category": "Footwear",
                "image_url": "https://example.com/nike.jpg"
            },
            {
                "name": "Levi's Jeans",
                "description": "Classic denim jeans",
                "price": 79.99,
                "stock": 75,
                "category": "Clothing",
                "image_url": "https://example.com/jeans.jpg"
            },
            {
                "name": "Coffee Maker",
                "description": "Automatic drip coffee maker",
                "price": 89.99,
                "stock": 25,
                "category": "Home",
                "image_url": "https://example.com/coffee.jpg"
            }
        ]
        
        for product_data in products:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print("✅ Sample products created")
        
    except Exception as e:
        print(f"❌ Error creating products: {str(e)}")
        db.rollback()
        raise

def main():
    """Main seeding function"""
    print(" Starting database seeding...")
    
    try:
        # Create tables
        create_tables()
        
        # Create database session
        db = SessionLocal()
        
        try:
            # Seed data
            seed_users(db)
            seed_products(db)
            
            print(" Database seeding completed successfully!")
            print("\n Summary:")
            print("   - Database tables created")
            print("   - 2 users created (1 admin, 1 regular user)")
            print("   - 5 sample products created")
            print("\n You can now start the server with: uvicorn main:app --reload")
            
        except Exception as e:
            print(f"❌ Error during seeding: {str(e)}")
            db.rollback()
            raise
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Fatal error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
