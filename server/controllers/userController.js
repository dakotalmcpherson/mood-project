const dbQueries = require('../models/dbQueries.js');
const bcrypt = require('bcrypt');

const userController = {};

userController.verifyUser = async (req, res, next) => {
  try {
    const result = await dbQueries.getOneUser(req.body.username);
    //console.log(result.rows[0]['password'])
    // const comparison = await bcrypt.compare(
    //   req.body.password,
    //   result.rows[0]['password']
    // );
    //console.log(comparison);
    res.locals.verified = true;
    return next();
  } catch (error) {
    return next('verify user error');
  }
};

userController.createUser = async (req, res, next) => {
  try {
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //console.log(hashedPassword)
    const createdUser = await dbQueries.createOneUser(
      req.body.username,
      hashedPassword
    );
    //console.log(createdUser)
    const results = await dbQueries.getAllUsers();
    res.locals.results = results;
    return next();
  } catch (error) {
    return next('create user error');
  }
};

module.exports = userController;
