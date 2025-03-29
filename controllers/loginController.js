const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const userService = new UserService();


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login that does not require a token.
 *     description: Returns a JWT token upon successful login.
 *     security: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: "Admin"
 *               password:
 *                 type: string
 *                 example: "Admin12345"
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 userId:
 *                   type: string
 *                   example: "1"
 *       401:
 *         description: Unauthorized login.
 */
router.post('/', async (req, res) => {
  const { userName, password } = req.body;
  try {
    const result = await userService.login( userName, password );
    if (!result) {
      console.log(`Log in with user: ${userName} and password: ${password} Failed`);
      return res.status(401).json({ token: "Login Failed" });
    }
    return res.status(200).json({ token: result.token, userId: result.userId });
  } catch (error) {
    console.log(`Login error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
