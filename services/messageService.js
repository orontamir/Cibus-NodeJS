const Repository =  require('../repositories/repository');
const repository = new Repository();
class MessageService {

  constructor() {
  }

  async getAllMessages() {
    try {
      const messages = await repository.getAllMessages();
      return messages;
    } catch (error) {
      console.log(`Error in getAllMessages: ${error.message}`);
      return [];
    }
  }

  async addMessage(model) {
    try {
      // Verify the user exists.
      const user = await repository.getUserById(model.userId);
      if (!user) {
        console.log(`Error Message: User does not exist`);
        return false;
      }
      // Check if a similar message already exists.
      const messages = await this.getAllMessages();
      const isMessageExist = messages.some(msg => msg.message === model.message);
      if (isMessageExist) {
        console.log(`Error Message: "${model.message}" already exists`);
        return false;
      }
      // Add the new message.
      await repository.addMessage(model);
      return true;
    } catch (error) {
      console.log(`Exception when adding message, error: ${error.message}`);
      return false;
    }
  }

  async getMessageByMessageId(id) {
    try {
      return await repository.getMessageById(id);
    } catch (error) {
      console.log(`Error in getMessageByMessageId: ${error.message}`);
      return null;
    }
  }

  async updateMessage(messageEntity, vote) {
    try {
      messageEntity.vote += vote;
      await repository.updateMessage(messageEntity);
      return true;
    } catch (error) {
      console.log(`Exception when updating message id ${messageEntity.id} with vote ${vote}: ${error.message}`);
      return false;
    }
  }

  async removeMessage(messageEntity) {
    try {
      await repository.removeMessage(messageEntity);
      return true;
    } catch (error) {
      console.log(`Exception when removing message id ${messageEntity.id}: ${error.message}`);
      return false;
    }
  }

  async getAllMessagesByUserId(userId) {
    try {
      const messages = await repository.getAllMessagesByUserId(userId);
      return messages;
    } catch (error) {
      console.log(`Error in getAllMessagesByUserId: ${error.message}`);
      return [];
    }
  }
}

module.exports = MessageService;
