"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateAdmin = exports.signin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists or not
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid Credentials, Email not found" });
            return;
        }
        // Validate Password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Credentials, wrong password" });
            return;
        }
        // Generate JWT (JSON Web Token)
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Signin Error : ", error);
        res.status(500).json({ message: "Internal Server  Error" });
    }
};
exports.signin = signin;
const initiateAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const count = await user_model_1.default.countDocuments({});
        if (count > 0) {
            res.status(400).json({
                message: "Admin already exists. Delete user manually from database to recreate admin.",
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            email,
            password: hashedPassword,
            name,
            role: "admin",
        });
        await newUser.save();
        res.status(201).json({
            message: "Admin user created successfully",
        });
    }
    catch (error) {
        console.error("Initiate admin error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.initiateAdmin = initiateAdmin;
