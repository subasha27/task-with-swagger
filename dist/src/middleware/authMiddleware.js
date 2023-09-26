"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.secretToken;
function authenticateJWT(req, res, next) {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.user = decoded;
        next();
    });
}
exports.authenticateJWT = authenticateJWT;
