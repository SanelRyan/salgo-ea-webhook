# Webhook Server for TradingView Alerts

This provides a webhook server to handle real-time TradingView alerts. It forwards incoming webhook data via WebSockets to connected clients and logs the alert information for future reference. The server also sets up an ngrok tunnel to expose the server to the internet, making it easier to receive webhooks from TradingView.

## Features

-   Accepts TradingView webhooks and logs the alert data to a file.
-   Broadcasts webhook data to all connected WebSocket clients.
-   Uses `ngrok` to expose the server for external access.
-   Logs client connections and disconnections via WebSocket.
-   Automatically pings WebSocket clients to maintain connection.

## Prerequisites

Make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v12 or later)
-   npm (comes with Node.js)
-   [ngrok](https://ngrok.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/sanelryan/tradingview-webhook-server.git
    cd tradingview-webhook-server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

### 1. Running the Server

Start the server using the following command:

```bash
npm start
```

This will:

-   Start an Express server to handle webhook POST requests.
-   Set up a WebSocket server on port `8080` to broadcast incoming webhook data.
-   Create an ngrok tunnel to expose the webhook endpoint to the internet.

### 2. Access Information

Once the server is running, the following information will be logged to the console:

-   The ngrok URL for sending TradingView webhooks (e.g., `http://<ngrok-url>/webhook`).
-   The WebSocket URL to connect clients (e.g., `ws://<ngrok-url>:8080`).

### 3. Sending Webhooks from TradingView

To use this with TradingView, go to your TradingView account, set up an alert, and configure the webhook URL with the ngrok URL:

```bash
http://<ngrok-url>/webhook
```

The TradingView alert payload should be in JSON format. Here is an example payload:

```json
{
	"action": "buy",
	"position": "long",
	"price": 50000,
	"symbol": "BTCUSD"
}
```

### 4. WebSocket Clients

WebSocket clients can connect to the WebSocket URL to receive real-time TradingView alert updates:

```bash
ws://<ngrok-url>:8080
```

### 5. Log File

Incoming webhook requests are logged in the `webhook_logs.json` file, located in the project root.

## File Structure

-   `index.js`: The main server file containing the Express and WebSocket logic.
-   `webhook_logs.json`: Stores the logs of all webhook requests.

## License

This project is licensed under the BSD-2-Clause License. See the [LICENSE](LICENSE) file for details.

---

By **Sanel Ryan**  
Licensed under BSD-2-Clause License
