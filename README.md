# 🤖 Gaia Marketing Agent

An AI-powered marketing agent that automatically promotes bounties on Twitter using the GAME architecture and Gaia's powerful language models.

## Overview

The Gaia Marketing Agent is designed to:
- 🎯 Automatically fetch and promote available bounties
- 🐦 Generate engaging tweets using AI
- 🎭 Maintain a consistent personality and voice
- ⏰ Handle scheduling and rate limiting
- 🔄 Track bounty status and updates

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gaia-marketing-agent
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

## Configuration

### Required Environment Variables

- `API_BASE_URL`: URL of your bounty API service
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token (from @BotFather)
- `OPENAI_API_KEY`: Your OpenAI API key for fallback
- `GAIANET_MODEL`: The Gaia model to use (default: llama)
- `GAIANET_SERVER_URL`: Gaia model server URL
- `ELIZA_CHARACTER_PATH`: Path to your agent's personality configuration

### Twitter Setup

1. Run the Twitter login script:
```bash
pnpm login-x
```

2. Follow the prompts to authenticate with Twitter
3. The script will save your credentials to `twitter-cookies.json`

## Usage

### Starting the Agent

```bash
pnpm run dev
```

The agent will:
1. Initialize required services
2. Connect to Twitter
3. Begin periodic bounty checks (every 25-35 minutes)
4. Generate and post tweets for new bounties

### Bounty Processing

The agent automatically:
1. Fetches unposted bounties from the API
2. Generates engaging tweets using the configured AI model
3. Posts tweets with proper spacing to avoid rate limits
4. Updates bounty status after successful posting

### Tweet Generation

Tweets are generated using:
- The agent's configured personality
- Bounty details (title, description, value)
- Optional metadata (tags, requirements, deadline)
- Best practices for engagement

Example tweet format:
```
🚀 [Exciting opener] [Bounty title/description]
💰 Reward: [Value]
⏰ Deadline: [Date if applicable]
#Bounty #Gaia #[RelevantTags]
```

## Architecture

### Core Components

- `BountyService`: Handles bounty fetching and management
- `TwitterService`: Manages Twitter authentication and posting
- `ElizaService`: Core agent runtime and personality management

### Key Features

- **Rate Limiting**: Built-in cooldown periods between API calls and tweets
- **Error Handling**: Robust error handling and logging
- **Status Tracking**: Tracks bounty and tweet status
- **Personality**: Consistent voice through AI-powered text generation
- **Scheduling**: Random intervals to avoid predictable patterns

## Development

### Adding New Features

1. Extend the `BountyService` for new bounty functionality
2. Modify tweet generation in `ElizaService._generateBountyTweet()`
3. Update scheduling in `ElizaService.start()`

### Customizing Agent Personality

1. Create a new character configuration file:
```json
{
  "name": "Your Agent Name",
  "bio": "Agent description and personality",
  "templates": {
    "messageHandlerTemplate": "Your custom template"
  }
}
```

2. Update `ELIZA_CHARACTER_PATH` in your `.env`

### Testing

1. Start the agent in development mode:
```bash
pnpm run dev
```

2. Monitor the logs for:
- Bounty fetching
- Tweet generation
- Posting status
- Error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
