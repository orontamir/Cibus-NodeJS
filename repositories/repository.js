const User = require('../models/user');
const Message  = require('../models/message');

class Repository {
  constructor() {
   
  }


  async createOrUpdate(model, whereClause, newValues) {
    const record = await model.findOne({ where: whereClause });
    if (record) {
      // Update if exists.
      await record.update(newValues);
      return record;
    } else {
      // Otherwise, create a new record.
      return await model.create(newValues);
    }
  }

  async update(model, whereClause, newValues) {
    const record = await model.findOne({ where: whereClause });
    if (record) {
      return await record.update(newValues);
    }
    throw new Error('Record not found');
  }

  async delete(model, whereClause) {
    const record = await model.findOne({ where: whereClause });
    if (record) {
      return await record.destroy();
    }
    throw new Error('Record not found');
  }

  async getAllMessages() {
    return await Message.findAll();
  }

  async getAllMessagesByUserId(userId) {
    return await Message.findAll({ where: { userId } });
  }

  async getMessageById(id) {
    return await Message.findOne({ where: { id } });
  }

  async addMessage(messageData) {
    return await Message.create(messageData);
  }

  async updateMessage(messageEntity) {
    const record = await Message.findOne({ where: { id: messageEntity.id } });
    if (record) {
      const updatedRecord = await record.update(messageEntity.dataValues);
      console.log('Updated record:', updatedRecord.dataValues);
      return updatedRecord;
    }
    throw new Error('Message not found');
  }

  async removeMessage(messageEntity) {
    const record = await Message.findOne({ where: { id: messageEntity.id } });
    if (record) {
      return await record.destroy();
    }
    throw new Error('Message not found');
  }

  async login(username, password) {
    return await User.findOne({ where: { userName: username, password } });
  }

  async getUserByUserName(username) {
    return await User.findOne({ where: { userName: username } });
  }

  async getUserById(id) {
    return await User.findOne({ where: { id } });
  }

  async addUser(userData) {
    return await User.create(userData);
  }
}

module.exports = Repository;
