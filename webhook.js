import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import chalk from "chalk";
import os from "os";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

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
	console.log(JSON.stringify(data));
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

		// Check if alertData contains a SEC_ID and if it matches the .env SEC_ID
		if (!alertData.SEC_ID || alertData.SEC_ID !== process.env.SEC_ID) {
			console.log(colors.error("❌ Invalid or missing SEC_ID"));
			return res.status(403).send(colors.error("🛑 Forbidden: Invalid SEC_ID"));
		}

		// Log and forward the request if SEC_ID matches
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

// Function to get the public IPv4 address
const getPublicIPv4 = () => {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return null;
};

const port = 3000;
app.listen(port, () => {
	console.log(colors.info(`🚀 Webhook server is listening on port ${port}...`));

	const ipv4 = getPublicIPv4();
	if (ipv4) {
		console.log(colors.info(`🌐 Server is accessible at: http://${ipv4}:${port}`));
		console.log(colors.info(`🌐 WebSocket server is available at: ws://${ipv4}:8080`));
	} else {
		console.log(colors.error("❌ No public IPv4 address found"));
	}
});
