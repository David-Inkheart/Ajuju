import joi from 'joi';

const registerSchema = joi.object({
  username: joi.string().alphanum().min(3).max(20).required(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(8).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const answerSchema = joi.object({
  // id: joi.number().integer().required(),
  content: joi.string().min(10).required(),
});

const idSchema = joi.number().integer().min(1).required();

const questionSchema = joi.object({
  title: joi.string().min(10).required(),
  content: joi.string().min(20).required(),
});

const changePasswordSchema = joi.object({
  currentPassword: joi.string().min(8).required(),
  newPassword: joi.string().min(8).required().disallow(joi.ref('currentPassword')),
});

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

const resetPasswordSchema = joi.object({
  email: joi.string().email().required(),
  newPassword: joi.string().min(8).required(),
  code: joi.string().required().length(5),
});

const searchSchema = joi.object({
  email: joi.string().email().required(),
});

const followSchema = joi.object({
  id: joi.number().integer().required(),
});

const voteAnswerSchema = joi.object({
  id: joi.number().integer().required(),
  answerId: joi.number().integer().required(),
  voteType: joi.string().valid('UPVOTE', 'DOWNVOTE').required(),
});

const voteQuestionSchema = joi.object({
  id: joi.number().integer().required(),
  voteType: joi.string().valid('UPVOTE', 'DOWNVOTE').required(),
});

const bioSchema = joi.object({
  bio: joi.string().min(10).max(100).required(),
});

export {
  loginSchema,
  registerSchema,
  answerSchema,
  questionSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  searchSchema,
  followSchema,
  idSchema,
  voteAnswerSchema,
  voteQuestionSchema,
  bioSchema,
};
