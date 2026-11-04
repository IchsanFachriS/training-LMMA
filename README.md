# WebGIS Minggu 1: Contoh Frontend + Backend

Contoh paling sederhana alur **Frontend → Backend → Data → Backend → Frontend**.

- Frontend: HTML, CSS, JavaScript, Leaflet
- Backend: Python + FastAPI
- Data: file `lokasi.geojson` (belum pakai database; PostgreSQL/PostGIS mulai Minggu 2)

## Struktur

```
webgis-minggu1/
├── backend/
│   ├── main.py              # 3 endpoint API + menyajikan frontend
│   ├── requirements.txt
│   └── data/lokasi.geojson  # 5 fitur: 3 Point, 1 LineString, 1 Polygon
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js               # fetch ke API, gambar di Leaflet, tampilkan request/response
```

## Cara menjalankan

Butuh Python 3.10 atau lebih baru.

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

Lalu buka **http://localhost:8000**.

## Endpoint

| Method | URL                | Hasil                                  |
|--------|--------------------|----------------------------------------|
| GET    | `/api/lokasi`      | 200 + FeatureCollection semua lokasi   |
| GET    | `/api/lokasi/{id}` | 200 + satu Feature, atau 404           |
| POST   | `/api/lokasi`      | 201 + Feature baru (disimpan di memori) |

Contoh body POST (coba di Thunder Client):

```json
{ "nama": "Gudang Timur", "jenis": "gudang", "lng": 107.63, "lat": -6.91 }
```

Data hasil POST hilang saat server dimatikan, karena belum ada database.

## Yang bisa diamati

1. Buka DevTools (F12) → tab **Network** → reload. Ada request `GET /api/lokasi` dengan status 200.
2. Klik nama lokasi di panel kanan → request `GET /api/lokasi/{id}`, peta zoom ke lokasi itu.
3. Klik tombol **Coba GET /api/lokasi/999** → status 404.
4. Panel kanan selalu menampilkan method, URL, status, waktu, dan body response terakhir.

## Batasan

Contoh ini sengaja dibuat minimal untuk Minggu 1. Database, routing FastAPI yang lebih lengkap,
validasi, CORS, dan deployment dibahas di minggu-minggu berikutnya.
