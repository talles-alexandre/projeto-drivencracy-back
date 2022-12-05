import joi from "joi";

const surveySchema = joi.object({
  title: joi.string().required(),
  expireAt: joi.string(),
});

const votingOptionsSchema = joi.object({
  title: joi.string().required(),
  pollId: joi.string().required(),
});

const formatOfAVoteSchema = joi.object({
  createAt: joi.number().required(),
  choiceID: joi.number().required(),
});

export { surveySchema, votingOptionsSchema, formatOfAVoteSchema };
