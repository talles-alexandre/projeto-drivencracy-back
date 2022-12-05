import db from "../databases/mongodb.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { surveySchema } from "../schemas/mySchemas.js";

async function pollPost(req, res) {
  const poll = req.body;

  const validation = surveySchema.validate(poll, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    res.status(422).send(errors);
    return;
  }

  let date = dayjs(poll.expireAt).format("YYYY-MM-DD HH:mm");
  if (poll.expireAt === "") {
    date = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");
  }

  const objectPoll = {
    title: poll.title,
    expireAt: date,
  };

  try {
    await db.collection("poll").insertOne(objectPoll);
    res.send(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function pollGet(req, res) {
  try {
    const polls = await db.collection("poll").find().toArray();
    res.send(polls);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function pollIdChoice(req, res) {
  const { id } = req.params;

  const existPoll = await db
    .collection("poll")
    .find({ _id: ObjectId(id) })
    .count();

  if (!existPoll) {
    res.status(404).send({ message: "Essa enquete não existe!" });
    return;
  }
  try {
    const choices = await db
      .collection("choice")
      .find({ pollId: id })
      .toArray();

    res.send(choices);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function resultGet(req, res) {
  const { id } = req.params;

  try {
    const resultsExists = await db
      .collection("poll")
      .findOne({ _id: ObjectId(id) });

    if (!resultsExists) {
      res.status(500).send({ message: "Essa enquete não existe!" });
      return;
    }

    const checkingAnswer = await db
      .collection("choice")
      .find({ pollId: id })
      .toArray();

    let winner = {
      title: "",
      votes: 0,
    };

    await Promise.all(
      checkingAnswer.map(async (answer) => {
        const votes = await db
          .collection("vote")
          .find({ choiceId: answer._id.toString() })
          .count();

        if (votes > winner.votes) {
          (winner.title = answer.title), (winner.votes = votes);
        }
      })
    );
    resultsExists.result = { ...winner };

    res.status(201).send(resultsExists);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { pollPost, pollGet, pollIdChoice, resultGet };
