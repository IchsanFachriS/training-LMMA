"""
Backend contoh Minggu 1.

Tujuannya hanya memperlihatkan alur request -> response.
Data dibaca dari file GeoJSON, belum dari database (database mulai Minggu 2).
Detail FastAPI (routing, parameter, validasi) dibahas di Minggu 4-5.
"""

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"
DATA_FILE = BASE_DIR / "data" / "lokasi.geojson"

# Data dimuat sekali ke memori saat server menyala.
# Data hasil POST hilang lagi saat server dimatikan.
data = json.loads(DATA_FILE.read_text(encoding="utf-8"))

app = FastAPI(title="WebGIS Minggu 1")


class LokasiBaru(BaseModel):
    nama: str
    jenis: str
    lng: float
    lat: float


@app.get("/api/lokasi")
def ambil_semua_lokasi():
    """GET /api/lokasi -> 200 + FeatureCollection"""
    return data


@app.get("/api/lokasi/{lokasi_id}")
def ambil_satu_lokasi(lokasi_id: int):
    """GET /api/lokasi/1 -> 200 + Feature, atau 404 jika tidak ada"""
    for feature in data["features"]:
        if feature["properties"]["id"] == lokasi_id:
            return feature
    raise HTTPException(status_code=404, detail="Lokasi tidak ditemukan")


@app.post("/api/lokasi", status_code=201)
def tambah_lokasi(lokasi: LokasiBaru):
    """POST /api/lokasi -> 201 + Feature baru (disimpan di memori saja)"""
    id_baru = max(f["properties"]["id"] for f in data["features"]) + 1
    feature = {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lokasi.lng, lokasi.lat]},
        "properties": {"id": id_baru, "nama": lokasi.nama, "jenis": lokasi.jenis},
    }
    data["features"].append(feature)
    return feature


# Frontend disajikan dari server yang sama, jadi cukup buka http://localhost:8000
# Baris ini harus paling bawah agar tidak menutupi route /api.
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
