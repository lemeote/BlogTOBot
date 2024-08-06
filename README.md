# BlogTO Bot
BlogTO Bot is a Twitter bot that reads blogTO's clickbaity tweets and replies with a short summary of the article.

## Requirements
You'll need your own OpenAI api key and free tier twitter API key.

## Setup
1. Create a `.env` file from the `.env.example`.
2. `yarn install`

## Usage
`yarn start`

## Cron Job
Currently the bot is set to run on a `*/30 * * * *` cron job, executing every 30 minutes.

## Contributing
Contributions are welcome! I don't know why you would, but feel free to submit pull requests or create issues.

## License
This project is licensed under the MIT License.
