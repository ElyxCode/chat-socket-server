const User = require("../models/user");
const Message = require("../models/message");

const userConnectd = async (uid) => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();

  return user;
};

const userDisconnect = async (uid) => {
  const user = await User.findById(uid);
  user.online = false;
  await user.save();

  return user;
};

const getUsers = async () => {
  const users = await User.find().sort("-online");
  return users;
};

const saveMessage = async (payload) => {
  try {
    const message = new Message(payload);
    await message.save();
    return message;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  userConnectd,
  userDisconnect,
  getUsers,
  saveMessage,
};
