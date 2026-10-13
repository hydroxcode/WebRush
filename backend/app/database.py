import os
import tempfile
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

def resolve_database_url() -> str:
    # 1. Explicit DATABASE_URL
    if os.environ.get("DATABASE_URL"):
        return os.environ["DATABASE_URL"]

    # 2. Explicit DB_PATH
    if os.environ.get("DB_PATH"):
        db_p = os.environ["DB_PATH"]
        return f"sqlite:///{db_p}" if not db_p.startswith("/") else f"sqlite:////{db_p.lstrip('/')}"

    # 3. Check Streamlit secrets if available
    try:
        import streamlit as st
        if hasattr(st, "secrets"):
            if "DATABASE_URL" in st.secrets:
                return st.secrets["DATABASE_URL"]
            if "DB_PATH" in st.secrets:
                db_p = st.secrets["DB_PATH"]
                return f"sqlite:///{db_p}" if not db_p.startswith("/") else f"sqlite:////{db_p.lstrip('/')}"
    except Exception:
        pass

    # 4. Try candidate paths in order of preference
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    candidates = [
        os.path.join(backend_dir, "insightflow.db"),
        os.path.join(os.getcwd(), "insightflow.db"),
        os.path.join(tempfile.gettempdir(), "insightflow.db"),
        "/tmp/insightflow.db"
    ]

    chosen = None
    for cand in candidates:
        try:
            parent_dir = os.path.dirname(cand)
            if parent_dir and not os.path.exists(parent_dir):
                os.makedirs(parent_dir, exist_ok=True)

            # If file already exists, test if it's readable and writable
            if os.path.exists(cand):
                with open(cand, "r+b"):
                    pass
                chosen = cand
                break
            else:
                # Test if we have write permission in parent directory
                test_file = cand + f".write_test_{os.getpid()}"
                with open(test_file, "w") as f:
                    f.write("ok")
                try:
                    os.remove(test_file)
                except Exception:
                    pass
                chosen = cand
                break
        except Exception as e:
            logger.debug(f"Candidate db path {cand} not writable: {e}")
            continue

    if not chosen:
        chosen = os.path.join(tempfile.gettempdir(), "insightflow.db")

    if chosen.startswith("/"):
        return f"sqlite:////{chosen.lstrip('/')}"
    else:
        return f"sqlite:///{chosen}"

SQLALCHEMY_DATABASE_URL = resolve_database_url()
DB_PATH = SQLALCHEMY_DATABASE_URL.replace("sqlite:////", "/").replace("sqlite:///", "")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
