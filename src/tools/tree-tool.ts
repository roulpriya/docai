import { promises as fs } from "node:fs";
import { join, relative, resolve } from "node:path";
import type { Tool } from "../agents";

interface TreeOptions {
	path?: string;
	maxDepth?: number;
	showHidden?: boolean;
	dirsOnly?: boolean;
}

interface TreeNode {
	name: string;
	path: string;
	type: "file" | "directory";
	children?: TreeNode[];
}

async function buildTree(
	dirPath: string,
	maxDepth = 3,
	currentDepth = 0,
	showHidden = false,
	dirsOnly = false,
): Promise<TreeNode[]> {
	if (currentDepth >= maxDepth) {
		return [];
	}

	try {
		const items = await fs.readdir(dirPath);
		const nodes: TreeNode[] = [];

		for (const item of items) {
			if (!showHidden && item.startsWith(".")) {
				continue;
			}

			const fullPath = join(dirPath, item);
			const stats = await fs.stat(fullPath);

			if (stats.isDirectory()) {
				const children = await buildTree(
					fullPath,
					maxDepth,
					currentDepth + 1,
					showHidden,
					dirsOnly,
				);
				nodes.push({
					name: item,
					path: fullPath,
					type: "directory",
					children,
				});
			} else if (!dirsOnly) {
				nodes.push({
					name: item,
					path: fullPath,
					type: "file",
				});
			}
		}

		return nodes.sort((a, b) => a.name.localeCompare(b.name));
	} catch (error) {
		return [];
	}
}

function formatTreeDFS(nodes: TreeNode[]): string {
	let result = "";

	function traverse(node: TreeNode) {
		result += `${node.name}\n`;

		if (node.children && node.children.length > 0) {
			// Sort children alphabetically before traversing
			const sortedChildren = [...node.children].sort((a, b) =>
				a.name.localeCompare(b.name),
			);
			for (const child of sortedChildren) {
				traverse(child);
			}
		}
	}

	// Sort top-level nodes alphabetically
	const sortedNodes = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
	for (const node of sortedNodes) {
		traverse(node);
	}

	return result;
}

async function treeHandler(
	args: TreeOptions,
): Promise<{ tree: string; success: boolean; error?: string }> {
	try {
		const targetPath = resolve(args.path || process.cwd());
		const maxDepth = args.maxDepth || 3;
		const showHidden = args.showHidden || false;
		const dirsOnly = args.dirsOnly || false;

		await fs.access(targetPath);
		const stats = await fs.stat(targetPath);

		if (!stats.isDirectory()) {
			return {
				tree: "",
				success: false,
				error: "Path is not a directory",
			};
		}

		const nodes = await buildTree(
			targetPath,
			maxDepth,
			0,
			showHidden,
			dirsOnly,
		);
		const tree = `${relative(process.cwd(), targetPath) || "."}\n${formatTreeDFS(nodes)}`;

		return {
			tree,
			success: true,
		};
	} catch (error) {
		return {
			tree: "",
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Unknown error generating tree",
		};
	}
}

export const treeTool: Tool<TreeOptions> = {
	name: "tree",
	description: "Display directory structure as a tree",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description:
					"The directory path to display (defaults to current directory)",
			},
			maxDepth: {
				type: "number",
				description: "Maximum depth to traverse (default: 3)",
			},
			showHidden: {
				type: "boolean",
				description: "Show hidden files and directories (default: false)",
			},
			dirsOnly: {
				type: "boolean",
				description: "Show only directories (default: false)",
			},
		},
		required: [],
	},
	handler: treeHandler,
};
