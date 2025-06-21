from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
from typing import Dict, Any, List

from core.database import get_db
from cart.models import Cart
from cart.schemas import CartAdd, CartUpdate, CartResponse, CartItemResponse
from products.models import Product
from utils.auth import get_current_user
from utils.db_helpers import get_value, safe_int, safe_float
from auth.models import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/")
async def add_to_cart(
    cart_data: CartAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add item to cart"""
    logger.info(f"User {current_user.email} adding product {cart_data.product_id} to cart")
    
    # Check if product exists and has sufficient stock
    product = db.query(Product).filter(Product.id == cart_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Product not found",
                "code": 404
            }
        )
    
    # Use helper functions to safely get values
    product_stock = safe_int(get_value(product, 'stock'))
    requested_quantity = safe_int(cart_data.quantity)
    
    if product_stock < requested_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": True,
                "message": f"Insufficient stock. Available: {product_stock}",
                "code": 400
            }
        )
    
    # Check if item already exists in cart
    existing_cart_item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == cart_data.product_id
    ).first()
    
    if existing_cart_item:
        # Use helper functions to safely get values
        existing_quantity = safe_int(get_value(existing_cart_item, 'quantity'))
        new_quantity = existing_quantity + requested_quantity
        
        if product_stock < new_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": True,
                    "message": f"Insufficient stock. Available: {product_stock}, In cart: {existing_quantity}",
                    "code": 400
                }
            )
        
        # Update using SQLAlchemy update method
        db.query(Cart).filter(Cart.id == existing_cart_item.id).update({"quantity": new_quantity})
        db.commit()
        logger.info(f"Updated cart item quantity to {new_quantity}")
    else:
        # Add new item
        cart_item = Cart(
            user_id=current_user.id,
            product_id=cart_data.product_id,
            quantity=requested_quantity
        )
        db.add(cart_item)
        db.commit()
        logger.info(f"Added new item to cart")
    
    return {"message": "Item added to cart successfully"}

@router.get("/", response_model=CartResponse)
async def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's cart"""
    logger.info(f"User {current_user.email} fetching cart")
    
    cart_items = db.query(Cart, Product).join(
        Product, Cart.product_id == Product.id
    ).filter(Cart.user_id == current_user.id).all()
    
    items: List[CartItemResponse] = []
    total_amount = 0.0
    total_items = 0
    
    for cart_item, product in cart_items:
        # Use helper functions to safely get values
        product_price = safe_float(get_value(product, 'price'))
        cart_quantity = safe_int(get_value(cart_item, 'quantity'))
        product_id = safe_int(get_value(product, 'id'))
        cart_id = safe_int(get_value(cart_item, 'id'))
        product_name = get_value(product, 'name', '')
        created_at = get_value(cart_item, 'created_at')
        
        subtotal = product_price * cart_quantity
        total_amount += subtotal
        total_items += cart_quantity
        
        item_dict: Dict[str, Any] = {
            "id": cart_id,
            "product_id": product_id,
            "product_name": product_name,
            "product_price": product_price,
            "quantity": cart_quantity,
            "subtotal": subtotal,
            "created_at": created_at
        }
        
        items.append(CartItemResponse.model_validate(item_dict))
    
    return CartResponse(
        items=items,
        total_items=total_items,
        total_amount=total_amount
    )

@router.put("/{product_id}")
async def update_cart_quantity(
    product_id: int,
    cart_data: CartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update cart item quantity"""
    logger.info(f"User {current_user.email} updating cart item {product_id}")
    
    # Find cart item
    cart_item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == product_id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Cart item not found",
                "code": 404
            }
        )
    
    # Check stock availability
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
    
    # Use helper functions to safely get values
    product_stock = safe_int(get_value(product, 'stock'))
    requested_quantity = safe_int(cart_data.quantity)
    cart_item_id = safe_int(get_value(cart_item, 'id'))
    
    if product_stock < requested_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": True,
                "message": f"Insufficient stock. Available: {product_stock}",
                "code": 400
            }
        )
    
    # Update using SQLAlchemy update method
    db.query(Cart).filter(Cart.id == cart_item_id).update({"quantity": requested_quantity})
    db.commit()
    
    logger.info(f"Cart item quantity updated to {requested_quantity}")
    return {"message": "Cart updated successfully"}

@router.delete("/{product_id}")
async def remove_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove item from cart"""
    logger.info(f"User {current_user.email} removing product {product_id} from cart")
    
    cart_item = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == product_id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Cart item not found",
                "code": 404
            }
        )
    
    db.delete(cart_item)
    db.commit()
    
    logger.info(f"Product {product_id} removed from cart")
    return {"message": "Item removed from cart successfully"}
