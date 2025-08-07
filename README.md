# AI Discord Bot

A Discord bot that uses the OpenRouter API to provide AI-powered responses to user questions through slash commands.

## Features

- 🤖 AI-powered responses using OpenRouter API
- 📝 Customizable system prompt via XML file
- ⚡ Slash command `/ask` for easy interaction
- 🎨 Beautiful embed responses
- 🔧 Configurable AI model and parameters
- 🛡️ Error handling and rate limiting

## Prerequisites

- Node.js 16.9.0 or higher
- A Discord bot token
- An OpenRouter API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd ai-bot
npm install
```

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   # Discord Bot Configuration
   DISCORD_TOKEN=your_discord_bot_token_here
   DISCORD_CLIENT_ID=your_discord_client_id_here

   # OpenRouter API Configuration
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

   # Bot Configuration
   DEFAULT_MODEL=anthropic/claude-3.5-sonnet
   MAX_TOKENS=1000
   TEMPERATURE=0.7
   ```

### 3. Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token and add it to your `.env` file
5. Go to "OAuth2" > "URL Generator"
6. Select "bot" and "applications.commands" scopes
7. Select the permissions you want (at minimum: "Send Messages", "Use Slash Commands")
8. Use the generated URL to invite the bot to your server

### 4. OpenRouter API Setup

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create an account and get your API key
3. Add the API key to your `.env` file

### 5. Deploy Commands

```bash
node deploy-commands.js
```

### 6. Start the Bot

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Usage

Once the bot is running, users can interact with it using the `/ask` slash command:

```
/ask question: What is the capital of France?
```

The bot will respond with an AI-generated answer in a beautiful embed format.

## Configuration

### System Prompt

The bot's behavior is controlled by the `system-prompt.xml` file. You can customize:

- **Role**: The bot's primary function
- **Guidelines**: How the bot should behave
- **Limitations**: What the bot should not do
- **Formatting**: How responses should be formatted for Discord

### Environment Variables

- `DISCORD_TOKEN`: Your Discord bot token
- `DISCORD_CLIENT_ID`: Your Discord application client ID
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `OPENROUTER_BASE_URL`: OpenRouter API base URL (usually doesn't need to change)
- `DEFAULT_MODEL`: The AI model to use (default: anthropic/claude-3.5-sonnet)
- `MAX_TOKENS`: Maximum tokens for AI responses (default: 1000)
- `TEMPERATURE`: AI response creativity (0.0-1.0, default: 0.7)

## Available Models

OpenRouter supports many AI models. Some popular options:

- `anthropic/claude-3.5-sonnet` (default)
- `openai/gpt-4`
- `openai/gpt-3.5-turbo`
- `google/gemini-pro`
- `meta-llama/llama-2-70b-chat`

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check if the bot token is correct and the bot is online
2. **Commands not working**: Make sure you've run `deploy-commands.js` and the bot has the "Use Slash Commands" permission
3. **API errors**: Verify your OpenRouter API key is correct and you have sufficient credits
4. **Permission errors**: Ensure the bot has the necessary permissions in your Discord server

### Logs

The bot provides detailed console logs for debugging. Check the console output for any error messages.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details. 