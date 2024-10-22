import express from "express";
import bodyParser from "body-parser";
import ngrok from "ngrok";
import { WebSocketServer } from "ws";
import fs from "fs";
import chalk from "chalk";

const app = express();
const wss = new WebSocketServer({ port: 8080 });
app.use(bodyParser.json());

const colors = {
	timestamp: chalk.blue,
	action: chalk.green,
	position: chalk.yellow,
	price: chalk.magenta,
	symbol: chalk.cyan,
	success: chalk.greenBright,
	error: chalk.red,
	info: chalk.white,
};

// Improved logRequest function
const logRequest = (data) => {
	console.log(JSON.stringify(logEntry));
};

wss.on("connection", (ws) => {
	console.log(colors.info("🤝 WebSocket client connected"));

	const pingInterval = setInterval(() => {
		if (ws.readyState === ws.OPEN) {
			ws.ping();
		}
	}, 30000);

	ws.on("close", () => {
		clearInterval(pingInterval);
		console.log(colors.info("👋 WebSocket client disconnected"));
	});

	ws.on("pong", () => {
		// Nice
	});
});

app.post("/webhook", (req, res) => {
	try {
		const alertData = req.body;
		logRequest(alertData);

		wss.clients.forEach((client) => {
			if (client.readyState === client.OPEN) {
				client.send(JSON.stringify(alertData));
			}
		});

		res.status(200).send(colors.success("✅ Webhook received successfully!"));
		console.log(colors.success("✅ Webhook received successfully!"));
	} catch (error) {
		console.error(colors.error("❌ Error handling webhook:", error));
		res.status(500).send(colors.error("🛑 Error processing webhook"));
	}
});

const port = 80;
app.listen(port, async () => {
	console.log(colors.info(`🚀 Webhook server is listening on port ${port}...`));

	try {
		const url = await ngrok.connect(port);
		console.log(colors.info(`🌉 Ngrok tunnel set up at: ${url}`));

		// Construct and log the WebSocket URL
		const wsUrl = `ws://${url.split("://")[1]}:8080`; // Use ws for WebSocket
		console.log(colors.info(`🌐 WebSocket server is available at: ${wsUrl}`)); // Log the WebSocket URL

		console.log(colors.info(`📬 Send TradingView webhooks to: ${url}/webhook`));
	} catch (error) {
		console.error(colors.error("❌ Error starting Ngrok:", error));
	}
});
