import { promises as fs } from "node:fs";
import { join, resolve } from "node:path";
import type { Tool } from "../agents/tool";

interface LsArgs {
	path?: string;
	all?: boolean;
	long?: boolean;
}

interface LsItem {
	name: string;
	type: "directory" | "file";
	size?: number;
	modified?: string;
	permissions?: string;
}

async function lsHandler(
	args: LsArgs,
): Promise<{ items: LsItem[]; success: boolean; error?: string }> {
	try {
		const targetPath = resolve(args.path || process.cwd());

		await fs.access(targetPath);
		const stats = await fs.stat(targetPath);

		if (!stats.isDirectory()) {
			return {
				items: [],
				success: false,
				error: "Path is not a directory",
			};
		}

		const items = await fs.readdir(targetPath);
		const results: LsItem[] = [];

		for (const item of items) {
			if (!args.all && item.startsWith(".")) {
				continue;
			}

			const fullPath = join(targetPath, item);
			const itemStats = await fs.stat(fullPath);

			if (args.long) {
				results.push({
					name: item,
					type: itemStats.isDirectory() ? "directory" : "file",
					size: itemStats.size,
					modified: itemStats.mtime.toISOString(),
					permissions: itemStats.mode.toString(8),
				});
			} else {
				results.push({
					name: item,
					type: itemStats.isDirectory() ? "directory" : "file",
				});
			}
		}

		results.sort((a, b) => {
			if (a.type === "directory" && b.type === "file") return -1;
			if (a.type === "file" && b.type === "directory") return 1;
			return a.name.localeCompare(b.name);
		});

		return {
			items: results,
			success: true,
		};
	} catch (error) {
		return {
			items: [],
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Unknown error listing directory",
		};
	}
}

export const lsTool: Tool<LsArgs> = {
	name: "ls",
	description: "List directory contents",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description:
					"The directory path to list (defaults to current directory)",
			},
			all: {
				type: "boolean",
				description: "Include hidden files and directories (default: false)",
			},
			long: {
				type: "boolean",
				description:
					"Use long listing format with detailed information (default: false)",
			},
		},
		required: [],
	},
	handler: lsHandler,
};
