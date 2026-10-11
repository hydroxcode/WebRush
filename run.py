import os
import sys
import webbrowser
import threading
import time
import uvicorn

def open_browser():
    time.sleep(1.8)
    print("\n[InsightFlow] Opening application at http://127.0.0.1:8000 ...")
    webbrowser.open("http://127.0.0.1:8000")

if __name__ == "__main__":
    # Ensure backend folder is in sys.path
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    print("=" * 65)
    print("  INSIGHTFLOW - Customer Feedback & Decision Platform")
    print("  Build Battle 2026 Hackathon | Frontend Arena")
    print("  Powered by Adaption Adaptive Data & Intelligence")
    print("=" * 65)
    print("  Starting unified server at: http://127.0.0.1:8000")
    print("  API Docs available at:     http://127.0.0.1:8000/docs")
    print("=" * 65)

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=False)
