#!/usr/bin/env node

import "dotenv/config.js";
import { existsSync } from "node:fs";
import { Git } from "./git";
import { updateReadme } from "./writer-agent";

interface ParsedArgs {
	path: string;
	baseRef?: string;
	headRef?: string;
	help: boolean;
}

function showHelp(): void {
	console.log(`Usage: docai [path] [options]

Arguments:
  path                 Repository path (default: current directory)

Options:
  -B, --base <ref>     Base reference for comparison
  -H, --head <ref>     Head reference for comparison  
  -h, --help           Show this help message

Examples:
  docai                          # Use current directory
  docai /path/to/repo            # Use specific path
  docai -B main -H feature       # Compare main to feature branch
  docai /path/to/repo -B v1.0.0  # Compare v1.0.0 to HEAD in specific path`);
}

function parseArgs(args: string[]): ParsedArgs {
	const parsed: ParsedArgs = {
		path: process.cwd(),
		help: false,
	};

	let i = 0;
	while (i < args.length) {
		const arg = args[i];

		if (arg === "-h" || arg === "--help") {
			parsed.help = true;
			i++;
		} else if (arg === "-B" || arg === "--base") {
			if (i + 1 >= args.length) {
				throw new Error(`Option ${arg} requires a value`);
			}
			parsed.baseRef = args[i + 1];
			i += 2;
		} else if (arg === "-H" || arg === "--head") {
			if (i + 1 >= args.length) {
				throw new Error(`Option ${arg} requires a value`);
			}
			parsed.headRef = args[i + 1];
			i += 2;
		} else if (!arg.startsWith("-")) {
			// Positional argument (path)
			parsed.path = arg;
			i++;
		} else {
			throw new Error(`Unknown option: ${arg}`);
		}
	}

	return parsed;
}

async function main() {
	try {
		const args = parseArgs(process.argv.slice(2));

		if (args.help) {
			showHelp();
			return;
		}

		// Validate path
		if (!existsSync(args.path)) {
			console.error(`Error: Path '${args.path}' does not exist.`);
			process.exit(1);
		}

		// Create Git instance
		const gitAnalyzer = new Git(args.path);

		// Use compareRefs method
		const { diff, warnings } = await gitAnalyzer.compareRefs(
			args.baseRef,
			args.headRef,
		);

		// Display warnings if any
		if (warnings.length > 0) {
			console.warn(warnings.join("\n"));
		}

		// Use the diff for documentation updates
		if (diff.trim()) {
			await updateReadme(diff, args.path);
		} else {
			console.log("No changes to process.");
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error("An unknown error occurred");
		}
		process.exit(1);
	}
}

if (require.main === module) {
	main().catch(console.error);
}
