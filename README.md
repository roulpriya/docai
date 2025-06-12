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
- Compare staged changes, or any two Git refs (branches, commits, tags) using CLI arguments
- Detects and updates documentation files automatically
- Warns about unstaged/untracked changes that are not included in diffs
- Notifies when no staged changes are found
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
  npx document-ai [<sourceRef> [<targetRef>]]
  ```
  or
  ```sh
  docai [path] [options]
  ```

### CLI Arguments
- `sourceRef` (optional): The base Git ref (commit, branch, or tag) to compare from.
- `targetRef` (optional): The target Git ref to compare to (defaults to `HEAD` if only `sourceRef` is provided).
- `path` (optional): Path to the repository (default: current directory)
- `-B, --base <ref>`: Base reference for comparison
- `-H, --head <ref>`: Head reference for comparison
- `-h, --help`: Show help message

**Examples:**
- Compare two specific refs:
  ```sh
  npx document-ai main feature-branch
  ```
  or
  ```sh
  docai -B main -H feature-branch
  ```
- Compare a ref to the current HEAD:
  ```sh
  npx document-ai 1234abcd
  ```
  or
  ```sh
  docai -B 1234abcd
  ```
- Default (no arguments): compares staged changes only.
- Specify a repository path:
  ```sh
  docai /path/to/repo -B main -H feature
  ```

**Note:**
- The tool will warn you if there are unstaged or untracked changes, as these are not included in the diff calculation.
- If no changes are found (e.g., no staged files), it will notify you and exit.

The agent will analyze the specified code changes in the Git repository and update or create documentation files as needed.

## Project Structure
```
document-ai/
├── src/
│   ├── agents/           # Agent and tool interfaces
│   ├── tools/            # File and directory manipulation tools
│   ├── git.ts            # Git integration and diff logic (now with flexible ref comparison, warnings, and path support)
│   ├── writer-agent.ts   # Main logic for documentation updating
│   └── index.ts          # CLI entry point (supports path, base/head, and help)
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
