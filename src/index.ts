#!/usr/bin/env node

import "dotenv/config.js";
import { Git } from "./git";
import { updateReadme } from "./writer-agent";

async function main() {
	const gitAnalyzer = new Git();
	const changes = await gitAnalyzer.getAllDiffs();

	await updateReadme(changes, process.cwd());
}

if (require.main === module) {
	main().catch(console.error);
}
