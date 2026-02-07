// src\middlewares\upload.middleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads"; // Definisikan direktori penyimpanan file upload -> "uploads"

// Cek apakah direktori upload sudah ada, jika belum buat direktori tersebut
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
};

const storage = multer.diskStorage({
    // Konfigurasi tempat file
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  }, // cb : callback

  // Konfigurasi nama file dengan karakter unik
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Konfigurasi file apa saja yang bisa di upload
const fileFilter = (req:any, file:Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images allowed"));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1025 * 1024} // 5MB
});