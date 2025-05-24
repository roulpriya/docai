import { Tool } from "../agents/tool";
import { promises as fs } from "fs";
import { resolve } from "path";

async function readFileHandler(args: { path: string }): Promise<{
	content: string;
	success: boolean;
	error?: string;
}> {
	try {
		const filePath = resolve(args.path);
		const content = await fs.readFile(filePath, "utf-8");
		return {
			content,
			success: true,
		};
	} catch (error) {
		return {
			content: "",
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown error reading file",
		};
	}
}

export const readTool: Tool = {
	name: "read",
	description: "Read the contents of a file from the filesystem",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description: "The file path to read",
			},
		},
		required: ["path"],
	},
	handler: readFileHandler,
};
