const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const userService = new UserService();
const MessageService = require('../services/messageService');
const messageService = new MessageService();
const authenticate = require('../middleware/authenticate');

/**
 * @swagger
 * /user/Messages:
 *   get:
 *     summary: Retrieve messages for the authenticated user.
 *     description: Returns a list of messages that belong to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad Request. Either the user does not exist or the Authorization header is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist in the Database"
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
router.get('/Messages', authenticate, async (req, res) => {
 
  if (req.token) {
    try {
      const userId = await userService.getUserId(req.token);
      if (userId) {
        const messages = await messageService.getAllMessagesByUserId(userId);
        return res.json(messages);
      }
      console.log("User does not exist in the Database");
      return res.status(400).json({ error: "User does not exist in the Database" });
    } catch (error) {
      console.log(`Error retrieving user messages: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.log("Authorization header not found");
    return res.status(400).json({ error: "Authorization header not found" });
  }
});

module.exports = router;
