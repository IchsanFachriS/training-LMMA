// Alamat API. Karena frontend disajikan oleh backend yang sama,
// cukup pakai path relatif.
const API_URL = "/api/lokasi";

// 1. Peta dasar
const map = L.map("map").setView([-6.914, 107.609], 14);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const layerLokasi = L.geoJSON(null, {
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`<b>${p.nama}</b><br>${p.jenis}`);
  }
}).addTo(map);

// 2. Fungsi kecil untuk mengirim request dan mencatat hasilnya di panel
async function kirimRequest(method, url) {
  const mulai = performance.now();
  const res = await fetch(url, { method });
  const body = await res.json();
  const waktu = Math.round(performance.now() - mulai);

  const kelas = res.ok ? "status-ok" : "status-error";
  document.getElementById("request").innerHTML = `
    Method : ${method}<br>
    URL    : ${url}<br>
    Status : <span class="${kelas}">${res.status} ${res.statusText}</span><br>
    Waktu  : ${waktu} ms`;
  document.getElementById("response").textContent = JSON.stringify(body, null, 2);

  return { ok: res.ok, body };
}

// 3. Ambil semua lokasi lalu gambar di peta
async function muatSemuaLokasi() {
  const { ok, body } = await kirimRequest("GET", API_URL);
  if (!ok) return;

  layerLokasi.addData(body);
  map.fitBounds(layerLokasi.getBounds(), { padding: [30, 30] });

  const daftar = document.getElementById("daftar");
  body.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = `${feature.properties.id}. ${feature.properties.nama}`;
    li.onclick = () => lihatDetail(feature.properties.id);
    daftar.appendChild(li);
  });
}

// 4. Ambil satu lokasi berdasarkan id, lalu zoom ke lokasi itu
async function lihatDetail(id) {
  const { ok, body } = await kirimRequest("GET", `${API_URL}/${id}`);
  if (!ok) return;
  map.fitBounds(L.geoJSON(body).getBounds(), { maxZoom: 16, padding: [40, 40] });
}

document.getElementById("tombol-404").onclick = () => lihatDetail(999);

muatSemuaLokasi();
