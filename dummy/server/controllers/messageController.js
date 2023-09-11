const Message = require('../models/MessageModel.js');

module.exports = {

  postMessage: async function(req, res, next) {
    const {message, password} = req.body;
    try {
      await Message.create({
        message: message,
        password: password,
      });
      res.cookie('pass', password);
      return next();
    } catch(err) {
      return next({log: err, message: 'postMessage failed in messageController'});
    }
  },

  getMessages: async function(req, res, next) {
    try {
      res.locals.messages = await Message.find({});
      return next();
    } catch(err) {
      return next({log: err, message: 'getMessages failed in messageController'});
    }
  },

  deleteMessage: async function(req, res, next) {
    const { id } = req.body;
    try {
      res.locals.messages = await Message.deleteOne({_id: id});
      return next();
    } catch(err) {
      return next({log: err, message: 'deleteMessage failed in messageController'});
    }
  },

};
