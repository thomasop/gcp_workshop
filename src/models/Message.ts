import { DataTypes, NOW } from "sequelize";
import connect from "../database/connect.js";
import Conversation from "./Conversation.js";

const Message = connect.define(
  "message",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    new: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    conversationId: {
      type: DataTypes.BIGINT,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

export default Message;
