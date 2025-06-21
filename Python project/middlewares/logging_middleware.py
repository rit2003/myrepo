from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        try:
            # Log request
            client_host = request.client.host if request.client else "unknown"
            method = request.method
            url = str(request.url)
            
            logger.info(f"Request: {method} {url} from {client_host}")
            
            # Process request
            response = await call_next(request)
            
            # Log response
            process_time = time.time() - start_time
            status_code = response.status_code
            
            logger.info(f"Response: {status_code} for {method} {url} - {process_time:.4f}s")
            
            return response
            
        except Exception as e:
            # Log error
            process_time = time.time() - start_time
            logger.error(f"Error processing request: {str(e)} - {process_time:.4f}s")
            raise
