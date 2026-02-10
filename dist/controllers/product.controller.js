"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (req.file) {
            productData.imageUrl = req.file.path;
        }
        if (productData.categoryId) {
            productData.category = productData.categoryId;
            delete productData.categoryId;
        }
        const product = new product_model_1.default(productData);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const products = await product_model_1.default.find()
            .populate("category")
            .sort({ createdAt: -1 });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await product_model_1.default.findById(req.params.id).populate("category");
        if (!product) {
            res.status(400).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (req.file) {
            productData.imageUrl = req.file.path;
        }
        const product = await product_model_1.default.findByIdAndUpdate(req.params.id, productData, { new: true });
        if (!product) {
            res.status(400).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await product_model_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(400).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted succesfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteProduct = deleteProduct;
