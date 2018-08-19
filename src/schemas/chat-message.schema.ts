import * as Joi from "joi";

export const ChatMessageSchema = {
    chatId: Joi.number().required(),
    text: Joi.string().max(500).trim().required(),
    senderId: Joi.number().required(),
    sentAt: Joi.string().isoDate(),
};
