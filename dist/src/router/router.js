"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("../controller/controller"));
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user by providing name, email, and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - mail
 *               - password
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: User Already exists
 *       500:
 *         description: Internal server error
 */
router.post('/signup', controller_1.default.signUp);
/**
 * @swagger
 * /createIt/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update user information by providing the user's ID.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define the properties you expect in the request body
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/createIt/:id', controller_1.default.updateUser);
/**
 * @swagger
 * /createIt/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user by providing the user's ID.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/createIt/:id', controller_1.default.deleteUser);
/**
 * @swagger
 * /getIt/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve user information by providing the user's ID.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getIt/:id', controller_1.default.getUser);
/**
 * @swagger
 * /getAll:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Users found
 *       500:
 *         description: Internal server error
 */
router.get('/getAll', controller_1.default.getAllUser);
/**
 * @swagger
 * /UserLogin:
 *   post:
 *     summary: User login
 *     description: Authenticate a user by providing email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - mail
 *               - password
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/UserLogin', controller_1.default.userSign);
/**
 * @swagger
 * /UserPassReset:
 *   post:
 *     summary: Request password reset
 *     description: Initiate a password reset request by providing email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *             required:
 *               - mail
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/UserPassReset', controller_1.default.passRequest);
/**
 * @swagger
 * /PassChange:
 *   post:
 *     summary: Change password
 *     description: Change the user's password after successful authentication and providing a new password.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: JWT authorization token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password successfully changed
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/PassChange', authMiddleware_1.authenticateJWT, controller_1.default.passChange);
exports.default = router;
