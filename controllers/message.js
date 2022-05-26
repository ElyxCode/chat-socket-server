const Message = require("../models/message");
// Recupera los mensajes de la DB.
const getChat = async (req, res) => {
  const myId = req.uid;

  const messageFrom = req.params.from;

  const lastThirtyMessages = await Message.find({
    $or: [
      {
        from: myId,
        to: messageFrom,
      },
      {
        from: messageFrom,
        to: myId,
      },
    ],
  })
    .sort({ createdAt: "desc" })
    .limit(30);

  res.json({
    ok: true,
    messages: lastThirtyMessages,
  });
};

module.exports = {
  getChat,
};
