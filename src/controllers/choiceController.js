import { votingOptionsSchema } from "../schemas/mySchemas.js";
import db from "../databases/mongodb.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

async function choicePost(req, res) {
  const { title, pollId } = req.body;

  try {
    const choice = {
      title: title,
      pollId: pollId,
    };

    const validation = votingOptionsSchema.validate(choice, {
      abortEarly: false,
    });

    if (validation.error) {
      res.status(422).send(error);
      return;
    }

    const existsPoll = await db
      .collection("poll")
      .find({ _id: ObjectId(pollId) })
      .toArray();

    if (!existsPoll.length) {
      res.status(404).send({ message: "Essa enquete não existe!" });
      return;
    }

    const datePoll = dayjs(existsPoll[0].expireAt).format("YYYY-MM-DD HH:mm");

    if (datePoll < dayjs().format("YYYY-MM-DD HH:mm")) {
      res.status(403).send({ message: "Enquete expirado!" });
      return;
    }

    const choiceExists = await db
      .collection("choice")
      .find({ title: title, pollId: pollId })
      .count();

    if (choiceExists) {
      res.send(409);
      return;
    }

    await db.collection("choice").insertOne(choice);

    res.send(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function votePost(req, res) {
  const { id } = req.params;

  try {
    const existChoice = await db
      .collection("choice")
      .findOne({ _id: ObjectId(id) });

    if (!existChoice) {
      res.status(404).send({ message: "Não existe essa opção de voto!" });
      return;
    }

    const poll = await db
      .collection("poll")
      .findOne({ _id: ObjectId(existChoice.pollId) });

    const checkDate = dayjs(poll.expireAt).format("YYYY-MM-DD HH:mm");

    if (checkDate < dayjs().format("YYYY-MM-DD HH:mm")) {
      res.status(403).send({ message: "Enquete expirado!" });
      return;
    }

    await db.collection("vote").insertOne({
      choiceId: id,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
    });
    res.sendStatus(201).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { choicePost, votePost };
