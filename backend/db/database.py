import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use SQLite for initial development
# In the future, this can easily be replaced with a PostgreSQL URL
# e.g., DATABASE_URL = "postgresql://user:password@localhost/dbname"

DATABASE_URL = "sqlite:///./phishing.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
