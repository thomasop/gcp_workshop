import { Request, Response } from "express";
import { Conversation, Message, User } from "../models/Association.js";
import { validationResult } from "express-validator";

const Add = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error });
  }
  let content = req.body.content;
  let user = req.body.user;
  let conversation = req.body.conversation;
  const addMessage = await Message.create({
    content: content,
    userId: user,
    conversationId: conversation,
  });
  const editConversation = await Conversation.update(
    { last_message_id: addMessage.dataValues.id },
    { where: { id: conversation } }
  );
  if (addMessage === null && editConversation === null) {
    return res.status(400).json({ error: "Error message" });
  } else {
    const findOne = await Message.findOne({
      where: { id: addMessage.dataValues.id },
      include: {
        model: User,
      },
    });
    if (findOne === null) {
      return res.status(400).json({ error: "Error message" });
    } else {
      res.status(200).json({ result: findOne });
    }
  }
};

const All = async (req: Request, res: Response) => {
  if (!req.params.id || !req.params) {
    return res.status(400).json({ errors: "No id param find" });
  }
  if (/[0-9]+/.test(req.params.id)) {
    const message = await Message.findAll({
      where: { conversationId: req.params.id },
      include: {
        model: User,
      },
    });
    if (message == null) {
      return res.status(400).json({ errors: "No message find" });
    } else {
      res.status(200).json({ result: message });
    }
  }
};

const Edit = async (req: Request, res: Response) => {
  console.log("eeeee");
  if (!req.params.conversationId || !req.params.otherIdUser || !req.params) {
    return res.status(400).json({ errors: "No id param find" });
  }
  if (
    /[0-9]+/.test(req.params.conversationId) &&
    /[0-9]+/.test(req.params.otherIdUser)
  ) {
    const selectAllNewMessages = await Message.findAll({
      where: {
        userId: req.params.otherIdUser,
        conversationId: req.params.conversationId,
        new: true,
      },
    });
    if (selectAllNewMessages === null) {
      return res
        .status(400)
        .json({ error: "Aucun nouveau message n'a pas été trouvé" });
    } else {
      const editMessage = await Message.update(
        { new: false },
        {
          where: {
            userId: req.params.otherIdUser,
            conversationId: req.params.conversationId,
          },
        }
      );
      res.status(200).json({ result: selectAllNewMessages });
    }
  }
};

export { Add, All, Edit };
