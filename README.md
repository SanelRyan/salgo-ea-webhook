Here is the updated `README.md` with the Telegram bot integration and acknowledgment of the code source:

````markdown
# Webhook Server for TradingView Alerts with Telegram Bot

A webhook server that handles real-time TradingView alerts. It forwards incoming webhook data via WebSockets to connected clients, sends alerts to Telegram subscribers, and logs the alert information for future reference.

## Features

-   Accepts TradingView webhooks and logs alert data.
-   Broadcasts webhook data to all connected WebSocket clients.
-   Sends alert notifications to subscribed Telegram users.
-   Logs client connections and disconnections via WebSocket.
-   Automatically pings WebSocket clients to maintain the connection.
-   Validates incoming requests using a secure `SEC_ID`.
-   Provides a list of supported symbols and timeframes via Telegram bot commands.

## Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v12 or later)
-   npm (comes with Node.js)
-   Create a `.env` file in the project root with the following content:

    ```plaintext
    SEC_ID=your_secret_id_here
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
    BOT_NAME=Trade Alert Bot
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

3. Set up a Telegram bot by contacting the [BotFather](https://t.me/BotFather) on Telegram to obtain your `TELEGRAM_BOT_TOKEN`. Add this token to the `.env` file.

## Usage

### 1. Running the Server

Start the server using the following command:

```bash
npm start
```
````

This will:

-   Start an Express server to handle webhook POST requests.
-   Set up a WebSocket server on port `8080` to broadcast incoming webhook data.
-   Activate the Telegram bot to handle subscriptions and notifications.

### 2. Access Information

Once the server is running, the following information will be logged to the console:

-   The URL for sending TradingView webhooks (e.g., `http://<your-server-ip>:3000/webhook`).
-   The WebSocket URL to connect clients (e.g., `ws://<your-server-ip>:8080`).
-   Your Telegram bot will be online and ready to subscribe users.

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

### 4. Telegram Bot Commands

Telegram users can interact with the bot using the following commands:

-   **/start**: Displays a welcome message with available commands.
-   **/alertme**: Subscribe/unsubscribe to real-time alerts.
-   **/supported**: Shows a list of supported trading symbols and timeframes.

### 5. WebSocket Clients

WebSocket clients can connect to the WebSocket URL to receive real-time TradingView alert updates:

```plaintext
ws://<your-server-ip>:8080
```

### 6. Log File

Incoming webhook requests are logged in the console, providing detailed information for each request.

## File Structure

-   `index.js`: The main server file containing the Express, WebSocket, and Telegram bot logic.
-   `.env`: Environment file for secure variables (e.g., `SEC_ID`, `TELEGRAM_BOT_TOKEN`).

## Code Overview

The server uses the following libraries and functionality:

-   **Express**: To handle HTTP requests.
-   **WebSocket**: To broadcast alerts to connected clients.
-   **Telegram Bot API**: To send alerts and handle user subscriptions.
-   **dotenv**: To manage environment variables.
-   **chalk**: To format console log messages for better readability.
-   **fs**: To store and retrieve subscriber information.

The server validates incoming webhook requests against the `SEC_ID` set in the `.env` file, ensuring that only authorized alerts are processed.

## License

This project is licensed under the BSD-2-Clause License. See the [LICENSE](LICENSE) file for details.

---

## Note:

This project contains code adapted from [github.com/SanelRyan/pico-finder](https://github.com/SanelRyan/pico-finder), as part of the webhook and bot integration functionality for handling alerts on a single :80 port and VPS

I was running the code on a single VPS on lightsail and tradingview only supports 80 port, so had to do this.
