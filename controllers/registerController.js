const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const userService = new UserService();
const authenticate = require('../middleware/authenticate');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     description: Creates a new user account with the provided userName and password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "cibus"
 *               password:
 *                 type: string
 *                 example: "cibus123"
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Registration failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User already exists. Please try with a different user name."
 */
router.post('/', authenticate, async (req, res) => {
  try {
    // Expecting a JSON body with userName and password.
    const result = await userService.register(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
