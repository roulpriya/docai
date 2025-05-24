import { Tool } from "../agents/tool";
import { promises as fs } from "fs";
import { join, resolve } from "path";

interface LsOptions {
	path?: string;
	all?: boolean;
	long?: boolean;
}

async function lsHandler(
	args: LsOptions,
): Promise<{ items: any[]; success: boolean; error?: string }> {
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
		const results = [];

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

export const lsTool: Tool = {
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
