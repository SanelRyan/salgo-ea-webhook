const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");

const app = express();

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
	console.log(`🚀 Webhook received:`, req.body);
	res.status(200).send("✅ Webhook received successfully!");
});

const port = 80;
app.listen(port, async () => {
	console.log(`🌐 Server is listening on port ${port}...`);

	const url = await ngrok.connect(port);
	console.log(`🔗 Ngrok tunnel set up at: ${url}`);
});
