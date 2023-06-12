const { ImageAnnotatorClient } = require("@google-cloud/vision");
const IMAGETEXT = require("../models/imagetext");
const GPT = require("../models/gpt");
const CONFIG = require("../utils/credentials");
const CreateGpt = async (req, res) => {
  const { image, message, userId } = req.body;
  const openai = req.app.get("gpt");
  let sentence = "";
  let text = "";

  if (image) {
    const client = new ImageAnnotatorClient(CONFIG);
    let [result] = await client.textDetection(image);
    const ress = result.textAnnotations[0].description.split("\n");
    sentence = ress.join(" ");
    try {
      await IMAGETEXT.create({ userId, imagetext: sentence });
    } catch (err) {
      console.log(err);
    }
  }

  try {
    const result = await IMAGETEXT.find({ userId });
    sentence = result.map((item) => item.imagetext).toString();
  } catch (err) {
    console.log(err);
  }

  try {
    const mymessage = await GPT.find({ userId });
    text = mymessage.map((item) => item.user).toString();
  } catch (err) {
    console.log(err);
  }

  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are AI Medicine Specialist chatbot. User will provide you the name of a medicine or prescription then you will describe the manufacturer ,uses, dosage, side effects, precaution of that medicine. Your response will be like that Manufacturer : describe the Manufacturer part, Uses : desribe the uses and follow the same rules for others parts",
        },

        {
          role: "user",
          content: text,
        },
        {
          role: "user",
          content: sentence,
        },
        {
          role: "user",
          content: message || "",
        },
      ],
    })
    .then((ress) => {
      const result = ress.data.choices[0].message.content;

      res.status(200).json({ message: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const createMessage = async (req, res) => {
  const { gpt, user, userId } = req.body;

  try {
    await GPT.create({ userId, user, gpt });
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ message: "create successfull" });
};
const getMessage = async (req, res) => {
  let data;
  const { userId } = req.params;

  try {
    data = await GPT.find({ userId });
  } catch (err) {
    console.log(err);
  }
  res.status(200).json(data);
};

module.exports = {
  CreateGpt,
  createMessage,
  getMessage,
};
