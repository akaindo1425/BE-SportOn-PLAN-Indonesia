"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBank = exports.updateBank = exports.getBanks = exports.createBank = void 0;
const bank_model_1 = __importDefault(require("../models/bank.model"));
const createBank = async (req, res) => {
    try {
        const bank = new bank_model_1.default(req.body);
        await bank.save();
        res.status(201).json(bank);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating bank", error });
    }
};
exports.createBank = createBank;
const getBanks = async (req, res) => {
    try {
        const banks = await bank_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(banks);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching banks", error });
    }
};
exports.getBanks = getBanks;
const updateBank = async (req, res) => {
    try {
        const bank = await bank_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!bank) {
            res.status(404).json({ message: "Bank not found" });
            return;
        }
        res.status(200).json(bank);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating bank", error });
    }
};
exports.updateBank = updateBank;
const deleteBank = async (req, res) => {
    try {
        const bank = await bank_model_1.default.findByIdAndDelete(req.params.id);
        if (!bank) {
            res.status(404).json({ message: "Bank not found" });
            return;
        }
        res.status(200).json({ message: "Bank deleted succesfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting bank", error });
    }
};
exports.deleteBank = deleteBank;
