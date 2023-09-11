const Message = require('../models/MessageModel.js');

module.exports = {
  checkAuth: async function(req, res, next) {
    const { id } = req.body;
    try {
      const message = await Message.findOne({_id: id}); 
      if (message.password === req.cookies.pass) return next();
      return next({status: 401, log: 'Recieved invalid password', message: 'Recieved invalid password'});
    } catch (err) {
      return next({log: err, message: 'checkAuth failed in authController'});
    }
  }
};