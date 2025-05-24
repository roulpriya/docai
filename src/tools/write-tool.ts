import { Tool } from "../agents";
import { promises as fs } from "fs";
import { dirname, resolve } from "path";

async function writeFileHandler(args: {
	path: string;
	content: string;
	createDir?: boolean;
}): Promise<{
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
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown error writing file",
		};
	}
}

export const writeTool: Tool = {
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
