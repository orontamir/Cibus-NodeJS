const express = require('express');
const router = express.Router();
const MessageService = require('../services/messageService');
const messageService = new MessageService();
const UserService = require('../services/userService');
const userService = new UserService();
const authenticate = require('../middleware/authenticate');

// GET all messages
/**
 * @swagger
 * /Messages:
 *   get:
 *     summary: Retrieve all messages.
 *     description: Retrieves a list of all messages stored in the system.
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
 *       500:
 *         description: Error retrieving messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving messages"
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await messageService.getAllMessages();
    res.json(messages);
  } catch (error) {
    console.log(`Error retrieving messages: ${error.message}`);
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

// POST a new message
/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Add a new message.
 *     description: Adds a new message from an authenticated user. A valid Bearer token is required in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello, this is my new message."
 *     responses:
 *       200:
 *         description: Message added successfully.
 *       400:
 *         description: Bad Request - either the Authorization header is missing/invalid, the user does not exist, or the message is not provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist in the Database"
 *       500:
 *         description: Internal Server Error.
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
      const userId = await userService.getUserId(req.token);
      if (!userId) {
        console.log("User does not exist in the Database");
        return res.status(400).json({ error: "User does not exist in the Database" });
      }
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const messageModel = { message, userId, vote: 1 };
      const result = await messageService.addMessage(messageModel);
      if (result) return res.sendStatus(200);
      console.log(`Exception when adding new message: ${message}`);
      return res.status(400).json({ error: `Exception when adding new message: ${message}` });
    } catch (error) {
      console.log(`Error adding message: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.log("Authorization header not found");
    return res.status(400).json({ error: "Authorization header not found" });
  }
});

// POST vote for a message
/**
 * @swagger
 * /messages/{message_id}/Vote:
 *   post:
 *     summary: Update the vote for a specific message.
 *     description: Updates the vote count for the message identified by message_id. Requires a valid Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         description: The ID of the message to update.
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: integer
 *                 description: The vote value to be added to the current vote count (e.g., 1 for an upvote, -1 for a downvote).
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vote updated successfully.
 *       400:
 *         description: Bad Request - either the message does not exist or there was an error updating the vote.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message id 123 does not exist"
 */
router.post('/:message_id/Vote', authenticate, async (req, res) => {
  const { message_id } = req.params;
  const { value } = req.body; // Expecting the vote value in the body.
  try {
    const messageEntity = await messageService.getMessageByMessageId(parseInt(message_id, 10));
    if (messageEntity) {
      await messageService.updateMessage(messageEntity, value);
      return res.sendStatus(200);
    }
    console.log(`Message id ${message_id} does not exist`);
    return res.status(400).json({ error: `Message id ${message_id} does not exist` });
  } catch (error) {
    console.log(`Exception when updating message id ${message_id}: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

// DELETE a message
/**
 * @swagger
 * /messages/{message_id}:
 *   delete:
 *     summary: Delete a message.
 *     description: Deletes the message identified by the given message_id. A valid Bearer token is required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         description: The ID of the message to be deleted.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Message deleted successfully.
 *       400:
 *         description: Bad Request - either the message does not exist or an error occurred during deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message id 123 does not exist"
 */
router.delete('/:message_id', authenticate, async (req, res) => {
  const { message_id } = req.params;
  try {
    const messageEntity = await messageService.getMessageByMessageId(parseInt(message_id, 10));
    if (messageEntity) {
      await messageService.removeMessage(messageEntity);
      return res.sendStatus(200);
    }
    console.log(`Message id ${message_id} does not exist`);
    return res.status(400).json({ error: `Message id ${message_id} does not exist` });
  } catch (error) {
    console.log(`Exception when deleting message id ${message_id}: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
