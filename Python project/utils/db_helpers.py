#Database helper functions to handle SQLAlchemy type issues

from typing import Any

def get_value(obj: Any, attr: str, default: Any = None) -> Any:
    """
    Safely get attribute value from SQLAlchemy model instance
    This helps avoid Pylance type checking issues with Column types
    """
    try:
        if obj is None:
            return default
        value = getattr(obj, attr, default)
        return value
    except Exception:
        return default

def safe_int(value: Any, default: int = 0) -> int:
    """Safely convert value to int"""
    try:
        if value is None:
            return default
        return int(value)
    except (ValueError, TypeError):
        return default

def safe_float(value: Any, default: float = 0.0) -> float:
    """Safely convert value to float"""
    try:
        if value is None:
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_str(value: Any, default: str = "") -> str:
    """Safely convert value to string"""
    try:
        if value is None:
            return default
        return str(value)
    except (ValueError, TypeError):
        return default

def safe_bool(value: Any, default: bool = False) -> bool:
    """Safely convert value to bool"""
    try:
        if value is None:
            return default
        return bool(value)
    except (ValueError, TypeError):
        return default

def safe_enum_value(enum_obj: Any, default: str = "") -> str:
    """Safely get value from enum object"""
    try:
        if enum_obj is None:
            return default
        if hasattr(enum_obj, 'value'):
            return str(enum_obj.value)
        return str(enum_obj)
    except Exception:
        return default
