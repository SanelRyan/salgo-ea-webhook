const express = require("express");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");
const { WebSocketServer } = require("ws");

// Initialize Express and WebSocketServer
const app = express();
const wss = new WebSocketServer({ port: 8080 });

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// WebSocket connection handling
wss.on("connection", (ws) => {
	console.log("🔌 WebSocket client connected");

	ws.on("close", () => {
		console.log("❌ WebSocket client disconnected");
	});
});

// Webhook endpoint to receive TradingView alerts
app.post("/webhook", (req, res) => {
	const alertData = req.body;
	console.log(`🚀 Webhook received:`, alertData);

	// Broadcast the data to all connected WebSocket clients (e.g., EA)
	wss.clients.forEach((client) => {
		if (client.readyState === client.OPEN) {
			client.send(JSON.stringify(alertData)); // Forward the alert data to EA
		}
	});

	res.status(200).send("✅ Webhook received successfully!");
});

// Start Express server and Ngrok tunnel
const port = 80;
app.listen(port, async () => {
	console.log(`🌐 Webhook server is listening on port ${port}...`);

	const url = await ngrok.connect(port);
	console.log(`🔗 Ngrok tunnel set up at: ${url}`);
	console.log(`📬 Send TradingView webhooks to: ${url}/webhook`);
});
