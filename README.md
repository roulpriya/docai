# Document AI

AI-powered document agent that analyzes code changes and updates documentation automatically.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview
Document AI is an automation tool designed to keep project documentation up to date by analyzing code changes and automatically editing or generating documentation files such as `README.md`, `CONTRIBUTING.md`, and `DESIGN.md`. It leverages OpenAI's LLMs and integrates with Git for accurate change tracking.

## Features
- Analyzes code changes using Git
- Detects and updates documentation files automatically
- Supports TypeScript and Node.js projects
- Uses OpenAI API for language generation
- Modular tools for file reading, writing, tree listing, and directory listing
- Extensible agent-based architecture
- Command-line interface via `bin` entry (now available as `document-ai`)

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd document-ai
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the project root and add your OpenAI API key:
     ```sh
     OPENAI_API_KEY=your-openai-api-key
     ```
4. **Build the project:**
   ```sh
   npm run build
   ```

## Usage

You can run Document AI in development or production mode, or directly via the CLI after building:

- **Development:**
  ```sh
  npm run dev
  ```
- **Production:**
  ```sh
  npm start
  ```
- **As a CLI Tool:**
  ```sh
  npx document-ai
  ```

The agent will analyze your current code changes in the Git repository and update or create documentation files as needed.

## Project Structure
```
document-ai/
├── src/
│   ├── agents/           # Agent and tool interfaces
│   ├── tools/            # File and directory manipulation tools
│   ├── git.ts            # Git integration and diff logic
│   ├── writer-agent.ts   # Main logic for documentation updating
│   └── index.ts          # Entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── README.md             # Project documentation
└── ...
```

## Contributing

Contributions are welcome! Please follow these guidelines:
- Open issues for bugs or feature requests.
- Submit pull requests from feature branches.
- Ensure code is linted and type-checked (`npm run lint`, `npm run typecheck`).
- Add or update tests and documentation as needed.

## License

This project is licensed under the MIT License.
