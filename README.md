# i18n.name - Multilingual Domain Name Scanner

A web application that helps you find available domain names across multiple languages. This tool translates your keyword into various languages using OpenAI's GPT-4o mini, checks domain availability using RDAP, and provides traffic data for registered domains.

## Features

- Translate keywords into multiple languages using OpenAI's GPT-4o mini
- Check domain availability across different TLDs
- View domain registration dates for registered domains
- See traffic data for registered domains
- User-friendly interface with real-time updates

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **APIs**: OpenAI API, RDAP for domain status
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and Bun
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd i18n-domain-scanner
bun install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Deployment

The application is designed to be deployed on Vercel. Connect your repository to Vercel and make sure to add the environment variables in the Vercel dashboard.

## How It Works

1. **Input**: User enters a keyword and selects domain extensions (TLDs)
2. **Translation**: The app translates the keyword into multiple languages using OpenAI's GPT-4o mini
3. **Domain Generation**: Combines translations with selected TLDs
4. **Availability Check**: Checks domain availability using RDAP
5. **Traffic Data**: For registered domains, gets traffic data for the last 3 months

## License

MIT

## Credits

Created for i18n.name
