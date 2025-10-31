from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import uvicorn
import os
import json

app = FastAPI(title="Local Model API", version="1.0.0")

# Where to persist any intermediate artifacts if you want
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat() + "Z"}


@app.post("/predict")
async def predict(
    documents: List[UploadFile] = File(default=[]),
    metadata: Optional[str] = Form(default=None),
):
    """
    Accepts multiple files under field name 'documents' and an optional JSON string 'metadata'.
    Returns a JSON result suitable for saving by the Node backend.

    Replace the dummy "model" logic below with your notebook/model inference code.
    """
    # Parse metadata if provided
    meta = None
    if metadata:
        try:
            meta = json.loads(metadata)
        except Exception:
            meta = {"raw": metadata}

    saved_files_info = []
    for f in documents:
        # If you want to read file content into memory:
        # content = await f.read()
        # For now, we just record their names and sizes without persisting
        size = 0
        try:
            content = await f.read()
            size = len(content)
        finally:
            await f.close()
        saved_files_info.append({
            "filename": f.filename,
            "size_bytes": size,
            "content_type": f.content_type or None,
        })

    # TODO: Replace this with actual model inference
    # Example of a plausible result structure:
    result = {
        "summary": "Processed {} document(s)".format(len(saved_files_info)),
        "files": saved_files_info,
        "metadata": meta,
        "predictions": [
            {
                "filename": info["filename"],
                "label": "example_label",
                "confidence": 0.95,
            }
            for info in saved_files_info
        ],
        "run_at": datetime.utcnow().isoformat() + "Z",
        "model_version": "demo-1.0"
    }

    return JSONResponse(content=result)


if __name__ == "__main__":
    # Run locally: python server.py
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)
