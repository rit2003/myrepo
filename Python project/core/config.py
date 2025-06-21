from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str 
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int 
    REFRESH_TOKEN_EXPIRE_DAYS: int 
    
    # Email
    SMTP_HOST: str
    SMTP_PORT: int 
    SMTP_USERNAME: str 
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str 

    # App
    APP_NAME: str 
    DEBUG: bool 
    
    class Config:
        env_file = ".env"

settings = Settings() # type: ignore
