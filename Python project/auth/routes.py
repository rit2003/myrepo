from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging
from typing import Dict, Any

from core.database import get_db
from auth.models import User, PasswordResetToken
from auth.schemas import (
    UserSignup, UserSignin, ForgotPassword, ResetPassword,
    UserResponse, TokenResponse, MessageResponse
)
from auth.utils import (
    hash_password, verify_password, create_access_token, 
    create_refresh_token, generate_reset_token, send_reset_email
)
from utils.db_helpers import get_value, safe_int

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """User signup endpoint"""
    logger.info(f"Signup attempt for email: {user_data.email}")
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        logger.warning(f"Signup failed - email already exists: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": True,
                "message": "Email already registered",
                "code": 400
            }
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Use helper functions to safely get values
    user_role = get_value(new_user, 'role')
    user_dict: Dict[str, Any] = {
        "id": safe_int(get_value(new_user, 'id')),
        "name": get_value(new_user, 'name', ''),
        "email": get_value(new_user, 'email', ''),
        "role": user_role
    }
    
    logger.info(f"User created successfully: {user_data.email}")
    return UserResponse.model_validate(user_dict)

@router.post("/signin", response_model=TokenResponse)
async def signin(user_data: UserSignin, db: Session = Depends(get_db)):
    """User signin endpoint"""
    logger.info(f"Signin attempt for email: {user_data.email}")
    
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, get_value(user, 'hashed_password', '')):
        logger.warning(f"Signin failed for email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": True,
                "message": "Invalid email or password",
                "code": 401
            }
        )
    
    # Use helper functions to safely get values
    user_id = safe_int(get_value(user, 'id'))
    user_role = get_value(user, 'role')
    
    # Handle role value safely
    role_value = user_role.value if hasattr(user_role, 'value') else str(user_role)
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user_id), "role": role_value})
    refresh_token = create_refresh_token(data={"sub": str(user_id)})
    
    # Convert SQLAlchemy model to dict for Pydantic
    user_dict: Dict[str, Any] = {
        "id": user_id,
        "name": get_value(user, 'name', ''),
        "email": get_value(user, 'email', ''),
        "role": user_role
    }
    
    logger.info(f"Signin successful for email: {user_data.email}")
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user_dict)
    )

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPassword, db: Session = Depends(get_db)):
    """Forgot password endpoint"""
    logger.info(f"Password reset requested for email: {request.email}")
    
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Don't reveal if email exists or not
        return MessageResponse(message="If the email exists, a reset link has been sent")
    
    # Generate reset token
    reset_token = generate_reset_token()
    expiration_time = datetime.now() + timedelta(hours=1)
    
    # Use helper function to safely get user ID
    user_id = safe_int(get_value(user, 'id'))
    user_email = get_value(user, 'email', '')
    
    # Save reset token
    reset_token_obj = PasswordResetToken(
        user_id=user_id,
        token=reset_token,
        expiration_time=expiration_time,
        used=False
    )
    db.add(reset_token_obj)
    db.commit()
    
    # Send email
    email_sent = send_reset_email(user_email, reset_token)
    if not email_sent:
        logger.error(f"Failed to send reset email to: {request.email}")
    
    logger.info(f"Password reset token generated for email: {request.email}")
    return MessageResponse(message="If the email exists, a reset link has been sent")

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    """Reset password endpoint"""
    logger.info(f"Password reset attempt with token: {request.token[:10]}...")
    
    # Find valid reset token
    reset_token_obj = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token,
        PasswordResetToken.used == False,
        PasswordResetToken.expiration_time > datetime.now()
    ).first()
    
    if not reset_token_obj:
        logger.warning(f"Invalid or expired reset token: {request.token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": True,
                "message": "Invalid or expired reset token",
                "code": 400
            }
        )
    
    # Use helper function to safely get user ID
    reset_token_user_id = safe_int(get_value(reset_token_obj, 'user_id'))
    reset_token_id = safe_int(get_value(reset_token_obj, 'id'))
    
    # Find user and update password
    user = db.query(User).filter(User.id == reset_token_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": True,
                "message": "User not found",
                "code": 404
            }
        )
    
    # Update password using SQLAlchemy update
    db.query(User).filter(User.id == reset_token_user_id).update({"hashed_password": hash_password(request.new_password)})
    
    # Mark token as used - using SQLAlchemy update
    db.query(PasswordResetToken).filter(PasswordResetToken.id == reset_token_id).update({"used": True})
    
    db.commit()
    
    logger.info(f"Password reset successful for user ID: {reset_token_user_id}")
    return MessageResponse(message="Password reset successful")
