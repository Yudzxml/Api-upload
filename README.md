# Uploader Project

## Deskripsi
Proyek ini adalah aplikasi uploader yang memungkinkan pengguna untuk meng-upload file ke repositori GitHub menggunakan Vercel.

## Kebutuhan
- Node.js
- Akun GitHub
- Token Akses GitHub
- Akun Vercel

## Instalasi
1. Clone repositori ini.
2. Jalankan `npm install` untuk menginstal dependensi.
3. Ganti `YOUR_USERNAME`, `YOUR_REPOSITORY`, dan `YOUR_GITHUB_TOKEN` di `api/upload.js` dengan informasi yang sesuai.

## Cara Menggunakan
1. Deploy proyek ke Vercel.
2. Gunakan alat seperti Postman untuk menguji endpoint upload:
   - **URL**: `https://your-vercel-project.vercel.app/api/upload`
   - **Method**: POST
   - **Body**: Form-data
     - **Key**: `file` (tipe: File)
     - **Value**: Pilih file yang ingin di-upload

3. Setelah file berhasil di-upload, Anda akan menerima respons JSON yang berisi pesan dan URL raw dari file yang di-upload.

## Contoh Respons
```json
{
  "message": "File uploaded successfully",
  "rawUrl": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPOSITORY/main/your_uploaded_file.ext"
}