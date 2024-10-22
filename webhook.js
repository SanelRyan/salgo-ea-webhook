import express from "express";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import chalk from "chalk";
import os from "os";

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

// Function to get the public IPv6 address
const getPublicIPv6 = () => {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === "IPv6" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return null;
};

const port = 3000;
app.listen(port, () => {
	console.log(colors.info(`🚀 Webhook server is listening on port ${port}...`));

	const ipv6 = getPublicIPv6();
	if (ipv6) {
		console.log(colors.info(`🌐 Server is accessible at: http://[${ipv6}]:${port}`));
		console.log(colors.info(`🌐 WebSocket server is available at: ws://[${ipv6}]:8080`));
	} else {
		console.log(colors.error("❌ No public IPv6 address found"));
	}
});
