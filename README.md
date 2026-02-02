# QuantStats & Technical Analysis Chat Interface

This project was bootstrapped using Vercel's ready-to-use AI chatbot template and enhanced with custom features for technical analysis. It provides a minimal, production-ready Next.js application with an integrated chat interface.

### Statcounter Note
The application includes a Statcounter web analytics code patch in `layout.tsx`. This tracking code is linked to my personal account, so all analytics data will be sent there. Please replace it with your own Statcounter ID or other analytics tracking code, or remove it entirely if you don't need web analytics.

## AI Co-Analyst Platform

For additional data analysis capabilities, visit our AI Co-Analyst Platform at [rex.tigzig.com](https://rex.tigzig.com). For any questions, reach out to me at amar@harolikar.com

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Server-side API routes

## Architecture Overview

### Secure Chat Implementation.
- Uses Next.js API routes to securely handle webhook communication
- Environment variables protect webhook URLs and sensitive configurations
- No client-side exposure of backend endpoints

### Component Structure

#### Chat Interface
- Real-time chat interface with markdown support
- Handles both text and structured data responses
- Supports system messages and loading states
- Mobile-responsive design with adaptive layouts

#### API Integration
- Connects to n8n Agent workflow through secure webhooks
- n8n workflow orchestrates multiple MCP servers
- Flexible webhook architecture - can be replaced with any agent webhook maintaining the same I/O format

### Backend Integration
The app serves as a frontend interface to a sophisticated n8n agentic workflow system:
- Primary webhook connects to n8n Agent workflow
- n8n manages connections to multiple MCP servers
- Modular design allows for easy webhook replacement
- Maintains consistent input/output format for compatibility

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your webhook URLs and other configurations
```

4. Run the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

The application is optimized for deployment on Vercel:
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy

## License

MIT License - feel free to use this code for your own projects.

## Note

This interface is designed to be a secure, efficient bridge between users and backend AI processing systems. While the frontend is open-source, it requires proper backend configuration (n8n workflows and MCP servers) to function fully.

## Application Structure Guide

This project contains some redundant files due to its evolution. I am continuying to refactor as we go along. 


### Notes on Structure

- The application uses Next.js App Router with the root-level `app/` directory
- Some duplication exists between `app/` and `src/app/` directories due to migration/refactoring
- Components use the `@/` import alias which maps to the `src/` directory
- Recent cleanup has removed redundant components and consolidated functionality

When making future changes, always target the active files listed above and ignore the redundant ones.

## Author

Built by [Amar Harolikar](https://www.linkedin.com/in/amarharolikar/)

Explore 30+ open source AI tools for analytics, databases & automation at [tigzig.com](https://tigzig.com)
