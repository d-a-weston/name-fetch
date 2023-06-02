const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/services.json", (req, res) => {
  res.json(require("./services.json").services);
});

app.get("/check/:platform/:username", (req, res) => {
  const { platform, username } = req.params;

  setTimeout(() => {
    res.json({
      service: platform,
      available: Math.random() > 0.5,
    });
  }, 500 * +(Math.random() * 2).toFixed(3));
});

app.listen(3001, () => {
  console.log("API mock server listening on port 3001");
});
