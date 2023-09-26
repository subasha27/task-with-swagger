"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../model.ts/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Email_1 = __importDefault(require("../helpers/Email"));
class UserController {
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, mail, password } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const existingUser = yield userModel_1.default.findOne({ where: { mail: mail } });
                if (existingUser)
                    return res.status(409).send({ message: "User Already Exists" });
                const user = yield userModel_1.default.create({ name, mail, password: hashedPassword });
                const id = user.id;
                res.status(200).json({ message: "User Registered Successfully", user, id });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred during signup.' });
            }
        });
    }
    ;
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const upDetails = req.body;
                if (upDetails.password) {
                    const upHashPass = yield bcrypt_1.default.hash(upDetails.password, 10);
                    upDetails.password = upHashPass;
                }
                const checkUser = yield userModel_1.default.findByPk(id);
                if (!checkUser) {
                    return res.status(404).json({ message: "Data Not Found" });
                }
                yield checkUser.update(upDetails);
                res.status(200).json({ message: "Updated", data: checkUser });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Server Error..." });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const checkUser = yield userModel_1.default.findByPk(id);
                if (!checkUser) {
                    return res.status(404).json({ message: "Data Not Found" });
                }
                yield checkUser.destroy();
                res.status(200).json({ message: "Deleted", });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Server Error..." });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const checkUser = yield userModel_1.default.findByPk(id);
                if (!checkUser) {
                    return res.status(404).json({ message: "Data Not Found" });
                }
                res.status(200).json({ userData: checkUser });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Server Error..." });
            }
        });
    }
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield userModel_1.default.findAll();
                if (!allUsers) {
                    return res.status(404).json({ message: "Data Not Found" });
                }
                res.status(200).json({ allData: allUsers });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Server Error..." });
            }
        });
    }
    userSign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetail = {
                    mail: req.body.mail,
                    password: req.body.password
                };
                const existingUser = yield userModel_1.default.findOne({ where: { mail: userDetail.mail } });
                if (!existingUser) {
                    return res.status(200).json(`User Does Not Exists`);
                }
                else {
                    const hash = yield bcrypt_1.default.compareSync(userDetail.password, existingUser.password);
                    if (existingUser.mail = userDetail.mail && hash) {
                        const token = jsonwebtoken_1.default.sign(userDetail.mail, process.env.secretToken);
                        return res.status(200).json({ message: "User login Successfull", token });
                    }
                    else {
                        return res.status(200).json({ message: "User login Failed" });
                    }
                }
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Server Error" });
            }
        });
    }
    passRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield userModel_1.default.findOne({ where: { mail: req.body.mail } });
                if (!existingUser) {
                    return res.status(200).json(`User Does Not Exists`);
                }
                else {
                    const resetToken = jsonwebtoken_1.default.sign(req.body.mail, process.env.secretToken);
                    const link = `http://localhost:${process.env.PORT}/api/PassChange/${resetToken}`;
                    (0, Email_1.default)(existingUser.mail, 'Password Reset Request', link);
                    return res.status(200).json({ message: "Password reset link sent successfully" });
                }
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    passChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = req.user;
                console.log(decodedToken);
                const existingUser = yield userModel_1.default.findOne({ where: { mail: decodedToken } });
                console.log(existingUser);
                if (!existingUser) {
                    return res.status(404).json({ message: "User not found" });
                }
                const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
                console.log(hashedPassword);
                yield existingUser.update({ password: hashedPassword });
                return res.status(200).json({ message: "Password changed successfully" });
            }
            catch (err) {
                console.error(err);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new UserController();
