require("dotenv").config();
const CREDENTIALS = JSON.parse(
  JSON.stringify({
    private_key: process.env.private_key,
    client_email: process.env.client_email,
  })
);

const CONFIG = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email,
  },
};

module.exports = CONFIG;
