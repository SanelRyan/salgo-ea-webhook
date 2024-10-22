# Webhook Server for TradingView Alerts

A webhook server that handles real-time TradingView alerts. It forwards incoming webhook data via WebSockets to connected clients and logs the alert information for future reference.

## Features

-   Accepts TradingView webhooks and logs alert data.
-   Broadcasts webhook data to all connected WebSocket clients.
-   Logs client connections and disconnections via WebSocket.
-   Automatically pings WebSocket clients to maintain the connection.
-   Validates incoming requests using a secure `SEC_ID`.

## Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v12 or later)
-   npm (comes with Node.js)
-   Create a `.env` file in the project root with the following content:

    ```plaintext
    SEC_ID=your_secret_id_here
    ```

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

### 2. Access Information

Once the server is running, the following information will be logged to the console:

-   The URL for sending TradingView webhooks (e.g., `http://<your-server-ip>:3000/webhook`).
-   The WebSocket URL to connect clients (e.g., `ws://<your-server-ip>:8080`).

### 3. Sending Webhooks from TradingView

To use this with TradingView, go to your TradingView account, set up an alert, and configure the webhook URL with your server's URL:

```plaintext
http://<your-server-ip>:3000/webhook
```

The TradingView alert payload should be in JSON format. Here’s an example payload:

```json
{
	"SEC_ID": "your_secret_id_here",
	"action": "buy",
	"position": "long",
	"price": 50000,
	"symbol": "BTCUSD"
}
```

### 4. WebSocket Clients

WebSocket clients can connect to the WebSocket URL to receive real-time TradingView alert updates:

```plaintext
ws://<your-server-ip>:8080
```

### 5. Log File

Incoming webhook requests are logged in the console, providing detailed information for each request.

## File Structure

-   `index.js`: The main server file containing the Express and WebSocket logic.
-   `.env`: Environment file for secure variables (e.g., `SEC_ID`).

## Code Overview

The server uses the following libraries and functionality:

-   **Express**: To handle HTTP requests.
-   **WebSocket**: To broadcast alerts to connected clients.
-   **dotenv**: To manage environment variables.
-   **chalk**: To format console log messages for better readability.

The server validates incoming webhook requests against the `SEC_ID` set in the `.env` file, ensuring that only authorized alerts are processed.

## License

This project is licensed under the BSD-2-Clause License. See the [LICENSE](LICENSE) file for details.

---

By **Sanel Ryan**  
Licensed under BSD-2-Clause License
