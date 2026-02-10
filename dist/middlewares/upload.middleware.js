"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src\middlewares\upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = "uploads"; // Definisikan direktori penyimpanan file upload -> "uploads"
// Cek apakah direktori upload sudah ada, jika belum buat direktori tersebut
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
;
const storage = multer_1.default.diskStorage({
    // Konfigurasi tempat file
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    }, // cb : callback
    // Konfigurasi nama file dengan karakter unik
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Konfigurasi file apa saja yang bisa di upload
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images allowed"));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1025 * 1024 } // 5MB
});
