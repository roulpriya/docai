export interface Tool {
	name: string;
	description: string;
	parameters: {
		type: "object";
		properties: Record<string, any>;
		required?: string[];
	};
	handler: (args: any) => Promise<any> | any;
}

export interface ToolCall {
	id: string;
	type: "function";
	function: {
		name: string;
		arguments: string;
	};
}

export interface ToolResult {
	tool_call_id: string;
	output: any;
}
