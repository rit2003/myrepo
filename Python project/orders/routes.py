from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
from typing import Dict, Any, List

from core.database import get_db
from orders.models import Order, OrderItem
from orders.schemas import OrderResponse, OrderDetailResponse, OrderListResponse, OrderItemResponse
from products.models import Product
from utils.auth import get_current_user
from utils.db_helpers import get_value, safe_int, safe_float
from auth.models import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=OrderListResponse)
async def get_order_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's order history"""
    logger.info(f"User {current_user.email} fetching order history")
    
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    total = len(orders)
    
    order_list: List[OrderResponse] = []
    for order in orders:
        order_dict: Dict[str, Any] = {
            "id": safe_int(get_value(order, 'id')),
            "user_id": safe_int(get_value(order, 'user_id')),
            "total_amount": safe_float(get_value(order, 'total_amount')),
            "status": get_value(order, 'status'),
            "created_at": get_value(order, 'created_at'),
        }
        order_list.append(OrderResponse.model_validate(order_dict))
    
    return OrderListResponse(
        orders=order_list, 
        total=total
    )

@router.get("/{order_id}", response_model=OrderDetailResponse)
async def get_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get order details with line items"""
    logger.info(f"User {current_user.email} fetching order {order_id} details")
    
    # Find order
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "Order not found",
                "code": 404
            }
        )
    
    # Get order items with product details
    order_items = db.query(OrderItem, Product).join(
        Product, OrderItem.product_id == Product.id
    ).filter(OrderItem.order_id == order_id).all()
    
    items: List[OrderItemResponse] = []
    for order_item, product in order_items:
        # Use helper functions to safely get values
        item_price = safe_float(get_value(order_item, 'price_at_purchase'))
        item_quantity = safe_int(get_value(order_item, 'quantity'))
        subtotal = item_price * item_quantity
        
        item_dict: Dict[str, Any] = {
            "id": safe_int(get_value(order_item, 'id')),
            "product_id": safe_int(get_value(order_item, 'product_id')),
            "product_name": get_value(product, 'name', ''),
            "quantity": item_quantity,
            "price_at_purchase": item_price,
            "subtotal": subtotal
        }
        items.append(OrderItemResponse.model_validate(item_dict))
    
    order_dict: Dict[str, Any] = {
        "id": safe_int(get_value(order, 'id')),
        "user_id": safe_int(get_value(order, 'user_id')),
        "total_amount": safe_float(get_value(order, 'total_amount')),
        "status": get_value(order, 'status'),
        "created_at": get_value(order, 'created_at'),
        "items": items
    }
    
    return OrderDetailResponse.model_validate(order_dict)
