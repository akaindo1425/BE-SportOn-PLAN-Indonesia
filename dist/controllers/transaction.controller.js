"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const createTransaction = async (req, res) => {
    try {
        const transactionData = req.body;
        console.log(transactionData, req?.file?.path);
        if (req.file) {
            transactionData.paymentProof = req.file.path;
        }
        else {
            res.status(400).json({ message: "Payment proof is required" });
            return;
        }
        if (typeof transactionData.purchasedItems === "string") {
            try {
                transactionData.purchasedItems = JSON.parse(transactionData.purchasedItems);
            }
            catch (error) {
                res.status(400).json({ message: "Invalid format for purchasedItems" });
                return;
            }
        }
        // forcing status to be "pending"
        transactionData.status = "pending";
        const transaction = new transaction_model_1.default(transactionData);
        await transaction.save();
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating transaction", error });
    }
};
exports.createTransaction = createTransaction;
const getTransactions = async (req, res) => {
    try {
        const transactions = await transaction_model_1.default.find()
            .sort({ createdAt: -1 })
            .populate("purchasedItems.productId");
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};
exports.getTransactions = getTransactions;
const getTransactionById = async (req, res) => {
    try {
        const transaction = await transaction_model_1.default.findById(req.params.id).populate("purchasedItems.productId");
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        res.status(200).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};
exports.getTransactionById = getTransactionById;
const updateTransaction = async (req, res) => {
    try {
        const { status } = req.body;
        const existingTransaction = await transaction_model_1.default.findById(req.params.id);
        if (!existingTransaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        if (status === "paid" && existingTransaction.status !== "paid") {
            for (const item of existingTransaction.purchasedItems) {
                await product_model_1.default.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.qty },
                });
            }
        }
        const transaction = await transaction_model_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(transaction);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating transaction status", error });
    }
};
exports.updateTransaction = updateTransaction;
