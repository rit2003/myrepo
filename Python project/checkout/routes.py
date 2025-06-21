from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
from typing import Dict, Any, List

from core.database import get_db
from cart.models import Cart
from products.models import Product
from orders.models import Order, OrderItem, OrderStatus
from utils.auth import get_current_user
from utils.db_helpers import get_value, safe_int, safe_float
from auth.models import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/")
async def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process checkout - dummy payment"""
    logger.info(f"User {current_user.email} initiating checkout")
    
    # Get cart items
    cart_items = db.query(Cart, Product).join(
        Product, Cart.product_id == Product.id
    ).filter(Cart.user_id == current_user.id).all()
    
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": True,
                "message": "Cart is empty",
                "code": 400
            }
        )
    
    # Validate stock and calculate total
    total_amount = 0.0
    order_items_data: List[Dict[str, Any]] = []
    
    for cart_item, product in cart_items:
        # Use helper functions to safely get values
        product_stock = safe_int(get_value(product, 'stock'))
        cart_quantity = safe_int(get_value(cart_item, 'quantity'))
        product_price = safe_float(get_value(product, 'price'))
        product_id = safe_int(get_value(product, 'id'))
        product_name = get_value(product, 'name', '')
        
        if product_stock < cart_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": True,
                    "message": f"Insufficient stock for {product_name}. Available: {product_stock}",
                    "code": 400
                }
            )
        
        subtotal = product_price * cart_quantity
        total_amount += subtotal
        
        order_items_data.append({
            "product_id": product_id,
            "quantity": cart_quantity,
            "price_at_purchase": product_price,
            "current_stock": product_stock
        })
    
    try:
        # Create order
        new_order = Order(
            user_id=current_user.id,
            total_amount=total_amount,
            status=OrderStatus.PAID  # Dummy payment always succeeds
        )
        db.add(new_order)
        db.flush()  # Get the order ID
        
        # Create order items and update stock
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                price_at_purchase=item_data["price_at_purchase"]
            )
            db.add(order_item)
            
            # Update product stock using SQLAlchemy update
            current_stock = item_data["current_stock"]
            item_quantity = item_data["quantity"]
            new_stock = current_stock - item_quantity
            db.query(Product).filter(Product.id == item_data["product_id"]).update({"stock": new_stock})
        
        # Clear cart
        db.query(Cart).filter(Cart.user_id == current_user.id).delete()
        
        db.commit()
        
        logger.info(f"Order {new_order.id} created successfully for user {current_user.email}")
        
        return {
            "message": "Order placed successfully",
            "order_id": new_order.id,
            "total_amount": total_amount,
            "status": "paid"
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Checkout failed for user {current_user.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": True,
                "message": "Checkout failed. Please try again.",
                "code": 500
            }
        )