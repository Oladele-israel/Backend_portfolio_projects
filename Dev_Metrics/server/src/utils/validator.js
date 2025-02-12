import Joi from "joi";

export const validateUserInput = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).messages({
      "string.empty": " name is required.",
      "string.min": " name must be at least 3 characters.",
      "string.max": "r name must not exceed 30 characters.",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Please provide a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};
