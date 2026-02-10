"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        if (req.file) {
            // ✅ PERBAIKAN: Gunakan forward slash
            categoryData.imageUrl = `uploads/${req.file.filename}`;
        }
        const category = new category_model_1.default(categoryData);
        await category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await category_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching categories ", error });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await category_model_1.default.findById(req.params.id);
        if (!category) {
            // ⚠️ Bug kecil: harusnya !category bukan !Category
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching category ", error });
    }
};
exports.getCategoryById = getCategoryById;
const updateCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        if (req.file) {
            // ✅ PERBAIKAN: Gunakan forward slash
            categoryData.imageUrl = `uploads/${req.file.filename}`;
        }
        const category = await category_model_1.default.findByIdAndUpdate(req.params.id, categoryData, { new: true });
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        // ✅ Tambahkan response yang hilang
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating category ", error });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await category_model_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting category ", error });
    }
};
exports.deleteCategory = deleteCategory;
