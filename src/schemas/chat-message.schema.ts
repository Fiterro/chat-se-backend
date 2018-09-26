import * as Joi from "joi";

export const ChatMessageSchema = {
    chatId: Joi.number().required(),
    text: Joi.string().max(500).trim().required(),
    uuid: Joi.string(),
    sentAt: Joi.string().isoDate(),
};
