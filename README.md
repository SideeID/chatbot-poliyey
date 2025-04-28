# JEMPOL - Jaringan Edukasi dan Informasi Layanan Mandiri POLIJE

<p align="center">
  <img src="/public/logo-jempol.png" alt="JEMPOL Logo" width="120" />
</p>

<p align="center">
  <b>Asisten AI Pintar untuk Informasi Akademik Politeknik Negeri Jember</b>
</p>

## 📝 Deskripsi

JEMPOL adalah chatbot AI yang dikembangkan untuk Pusat Informasi dan Pelayanan Terpadu (PINTU) Politeknik Negeri Jember. Chatbot ini dirancang untuk menyediakan informasi akurat tentang layanan akademik, profil dosen, prosedur administrasi, dan informasi kampus lainnya melalui antarmuka percakapan yang interaktif.

## ✨ Fitur Utama

- 💬 **Antarmuka Percakapan Interaktif** - Pengalaman chat yang mulus dengan dukungan markdown dan fitur UI/UX modern
- 🧠 **AI Cerdas** - Memanfaatkan model LLM canggih (Groq dan Google Generative AI) untuk pemahaman bahasa alami
- 🔍 **Pencarian Berbasis Vektor** - Retrieving informasi yang relevan dengan menggunakan Pinecone sebagai vector database
- 📚 **Basis Pengetahuan Komprehensif** - Informasi dari website POLIJE, data dosen, dan dokumen akademik
- 🌐 **Web Scraping Otomatis** - Sistem terjadwal untuk menjaga informasi tetap up-to-date
- 💡 **Saran Pertanyaan Lanjutan** - Menghasilkan saran pertanyaan yang relevan untuk membantu pengguna
- 🔒 **Filter Konten** - Memfilter kata-kata tidak pantas untuk menjaga interaksi tetap profesional
- 🌓 **Mode Gelap/Terang** - Dukungan tema untuk kenyamanan visual
- 📱 **Responsif** - Tampilan yang bekerja dengan baik di perangkat seluler dan desktop

## 🛠️ Teknologi

- **Framework**: Next.js dengan TypeScript
- **Styling**: Tailwind CSS dan Radix UI
- **LLM Integration**: LangChain
- **Vector Database**: Pinecone
- **AI Models**: Google Generative AI (Gemini) dan Groq
- **Database**: MongoDB untuk menyimpan pertanyaan pengguna
- **Web Scraping**: Puppeteer
- **Scheduling**: Node-cron

## 🚀 Cara Memulai

### Prasyarat

- Node.js (v18 atau lebih baru)
- npm atau yarn
- Akun Pinecone
- Akun Google AI Studio (untuk API key Gemini)
- Akun Groq (untuk API key Groq)
- Akun MongoDB (opsional, untuk menyimpan pertanyaan)

### Instalasi

1. Clone repositori:

```bash
git clone https://github.com/SideeID/chatbot-poliyey.git
cd chatbot-poltek-v2
```

2. Instal dependensi:

```bash
npm install
# atau
yarn install
```

3. Buat file `.env` berdasarkan contoh di `.env.example`:

```
GOOGLE_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
MONGODB_URI=your_mongodb_connection_string
INDEX_INIT_TIMEOUT=24000
SCRAPING_API_KEY=your_scraping_api_key
```

4. Siapkan data vektor:

```bash
# Untuk memproses dokumen PDF
npm run prepare:data

# Untuk web scraping dan pemrosesan data web
npm run prepare:web
```

### Pengembangan

Jalankan server pengembangan:

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi di browser.

### Produksi

Build aplikasi untuk produksi:

```bash
npm run build
# atau
yarn build
```

Jalankan build produksi:

```bash
npm start
# atau
yarn start
```

## 📂 Struktur Proyek

```
chatbot-poltek-v2/
├── docs/                   # Dokumen PDF dan teks untuk vector store
├── dosen/                  # Data dosen dalam format JSON
├── public/                 # Aset statis
├── scraped_docs/           # Hasil web scraping
├── src/
│   ├── app/                # App router pages dan API routes
│   ├── components/         # Komponen React
│   │   ├── ui/             # Komponen UI dasar
│   │   └── ...             # Komponen khusus aplikasi
│   ├── hooks/              # React hooks
│   ├── lib/                # Utilitas dan integrasi
│   ├── models/             # Schema MongoDB
│   ├── scripts/            # Skrip utilitas
│   └── services/           # Layanan backend
```

## 🧪 Web Scraping Manual

```bash
# Jalankan scraping web secara manual
npm run scrape:web
```

## 📄 API Routes

- `GET/POST /api/chat` - Endpoint untuk interaksi chat
- `GET/POST /api/questions` - Endpoint untuk manajemen pertanyaan
- `POST /api/scrape` - Endpoint untuk memicu scraping web manual

## 👨‍💻 Pengembangan Lebih Lanjut

### Menambahkan Data Dosen Baru

1. Tambahkan file JSON baru di direktori `/dosen` dengan format yang sesuai
2. Perbarui vector store dengan menjalankan `npm run prepare:data`

### Menambahkan Sumber Web Baru

1. Edit file `src/lib/web-loader.ts` dan tambahkan URL baru ke array `urls`
2. Jalankan scraping web dengan `npm run scrape:web`

## 🤝 Kontributor

- [Dimas Fajar](https://github.com/SideeID) - Developer Utama

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi:
- Instagram: [Side ID](https://www.instagram.com/side__id/)
- Website: [https://www.side.my.id/](https://www.side.my.id/)
