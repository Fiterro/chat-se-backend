import * as Joi from "joi";

export const ChatSchema = {
    name: Joi.string().min(5).required(),
};
