const express = require("express");
const mongoose = require("mongoose");
const { OpenAIApi, Configuration } = require("openai");
require("dotenv").config();
const cors = require("cors");
const GPT = require("./routes/gpt");
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.Secret_Key,
  })
);

app.set("gpt", openai);

app.use("/api/gpt", GPT);
app.listen(process.env.PORT);
