import { Request, Response } from "express";
import { Conversation, Message, User } from "../models/Association.js";
import connect from "../database/connect.js";
import { Op, QueryTypes } from "sequelize";
import { validationResult } from "express-validator";

interface Conversation {
  id: string;
  conversationId: string;
}

const Add = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: "probleme" });
  }
  let content = req.body.content;
  let userId = req.body.userId;
  let userIdAdd = req.body.userIdAdd;
  const addConversation = await Conversation.create({
    last_message_id: null,
    userOneId: userId,
    userTwoId: userIdAdd,
  });
  if (addConversation === null) {
    return res.status(400).json({ error: "La conversation n'a pas été créé" });
  } else {
    const addMessage = await Message.create({
      content: content,
      conversationId: addConversation.dataValues.id,
      userId: userId,
    });
    if (addMessage === null) {
      return res.status(400).json({ error: "Le message n'a pas été créé" });
    } else {
      const editConversation = await Conversation.update(
        { last_message_id: addMessage.dataValues.id },
        {
          where: {
            id: addConversation.dataValues.id,
          },
          returning: true,
        }
      );
      if (editConversation === null) {
        return res
          .status(400)
          .json({ error: "La conversation n'a pas été modifié" });
      } else {
        const oneConversation = await Conversation.findOne({
          where: {
            id: addConversation.dataValues.id,
          },
          include: [
            {
              model: User,
              as: "userOneAsId",
            },
            {
              model: User,
              as: "userTwoAsId",
            },
            {
              model: Message,
              include: [
                {
                  model: User,
                },
              ],
            },
          ],
        });
        if (oneConversation === null) {
          return res
            .status(400)
            .json({ error: "La conversation n'a pas été trouvé" });
        } else {
          res.status(200).json({ result: oneConversation });
        }
      }
    }
  }
};

const All = async (req: Request, res: Response) => {
  if (!req.params || !req.params.id) {
    return res.status(400).send("no id");
  }
  if (/[0-9]+/.test(req.params.id)) {
    const getAllConversation = await Conversation.findAll({
      where: {
        [Op.or]: [{ userOneId: req.params.id }, { userTwoId: req.params.id }],
      },
      include: [
        {
          model: User,
          as: "userOneAsId",
        },
        {
          model: User,
          as: "userTwoAsId",
        },
        {
          model: Message,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });
    if (getAllConversation === null) {
      return res.status(400).json({ error: "error" });
    } else {
      res.status(200).json({ result: getAllConversation });
    }
  }
};

export { All, Add };
