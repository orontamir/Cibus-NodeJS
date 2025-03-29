const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const userService = new UserService();
const authenticate = require('../middleware/authenticate');


/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the authenticated user.
 *     description: Removes the token for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *       400:
 *         description: Bad Request. Could be due to a missing or invalid Authorization header, or a token removal error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authorization header not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', authenticate, async (req, res) => {
  if (req.token) {
    try {
      const result = await userService.logout(req.token);
      if (result) return res.sendStatus(200);
      console.log("Exception when removing token");
      return res.status(400).json({ error: "Exception when removing token" });
    } catch (error) {
      console.log(`Logout error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.log("Authorization header not found");
    return res.status(400).json({ error: "Authorization header not found" });
  }
});

module.exports = router;
