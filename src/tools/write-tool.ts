import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Tool } from "../agents";

interface WriteArgs {
	path: string;
	content: string;
	createDir?: boolean;
}

async function writeFileHandler(args: WriteArgs): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const filePath = resolve(args.path);

		if (args.createDir) {
			const dir = dirname(filePath);
			await fs.mkdir(dir, { recursive: true });
		}

		await fs.writeFile(filePath, args.content, "utf-8");
		return {
			success: true,
		};
	} catch (error: unknown) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown error writing file",
		};
	}
}

export const writeTool: Tool<WriteArgs> = {
	name: "write",
	description: "Write content to a file on the filesystem",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description: "The file path to write to",
			},
			content: {
				type: "string",
				description: "The content to write to the file",
			},
			createDir: {
				type: "boolean",
				description:
					"Whether to create parent directories if they do not exist",
				default: false,
			},
		},
		required: ["path", "content"],
	},
	handler: writeFileHandler,
};
