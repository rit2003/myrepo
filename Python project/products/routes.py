from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import math
import logging

from core.database import get_db
from products.models import Product
from products.schemas import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from utils.auth import require_admin
from auth.models import User


router = APIRouter()
logger = logging.getLogger(__name__)

# Admin routes
@router.post("/admin/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new product (Admin only)"""
    logger.info(f"Admin {current_user.email} creating product: {product_data.name}")
    
    new_product = Product(**product_data.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    logger.info(f"Product created with ID: {new_product.id}")
    return ProductResponse.model_validate(new_product)

@router.get("/admin/products", response_model=ProductListResponse)
async def get_admin_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all products with pagination (Admin only)"""
    logger.info(f"Admin {current_user.email} fetching products page {page}")
    
    offset = (page - 1) * page_size
    
    products = db.query(Product).offset(offset).limit(page_size).all()
    total = db.query(Product).count()
    total_pages = math.ceil(total / page_size)
    
    return ProductListResponse(
        products=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/admin/products/{product_id}", response_model=ProductResponse)
async def get_admin_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get product details (Admin only)"""
    logger.info(f"Admin {current_user.email} fetching product {product_id}")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Product not found",
                "code": 404
            }
        )
    
    return ProductResponse.model_validate(product)

@router.put("/admin/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update product (Admin only)"""
    logger.info(f"Admin {current_user.email} updating product {product_id}")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Product not found",
                "code": 404
            }
        )
    
    # Update only provided fields
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    logger.info(f"Product {product_id} updated successfully")
    return ProductResponse.model_validate(product)

@router.delete("/admin/products/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete product (Admin only)"""
    logger.info(f"Admin {current_user.email} deleting product {product_id}")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Product not found",
                "code": 404
            }
        )
    
    db.delete(product)
    db.commit()
    
    logger.info(f"Product {product_id} deleted successfully")
    return {"message": "Product deleted successfully"}

# Public routes
@router.get("/products", response_model=ProductListResponse)
async def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = Query(None, pattern="^(price|name|created_at)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get products with filters and pagination"""
    logger.info(f"Fetching products with filters - category: {category}, price: {min_price}-{max_price}")
    
    query = db.query(Product)
    
    # Apply filters
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Apply sorting
    if sort_by == "price":
        query = query.order_by(Product.price)
    elif sort_by == "name":
        query = query.order_by(Product.name)
    elif sort_by == "created_at":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.id)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()
    
    total_pages = math.ceil(total / page_size)
    
    return ProductListResponse(
        products=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/products/search", response_model=ProductListResponse)
async def search_products(
    keyword: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search products by keyword"""
    logger.info(f"Searching products with keyword: {keyword}")
    
    query = db.query(Product).filter(
        or_(
            Product.name.ilike(f"%{keyword}%"),
            Product.description.ilike(f"%{keyword}%"),
            Product.category.ilike(f"%{keyword}%")
        )
    )
    
    total = query.count()
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()
    
    total_pages = math.ceil(total / page_size)
    
    return ProductListResponse(
        products=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product details"""
    logger.info(f"Fetching product details for ID: {product_id}")
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Product not found",
                "code": 404
            }
        )
    
    return ProductResponse.model_validate(product)
