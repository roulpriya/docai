import OpenAI from "openai";
import { Tool, ToolCall, ToolResult } from "./tool";

export interface AgentConfig {
	apiKey: string;
	model?: string;
	systemPrompt: string;
	temperature?: number;
	maxTokens?: number;
	tools?: Tool[];
}

export class Agent {
	private readonly openai: OpenAI;
	private readonly systemPrompt: string;
	private readonly model: string;
	private readonly temperature: number;
	private readonly tools: Map<string, Tool> = new Map();

	constructor(config: AgentConfig) {
		this.openai = new OpenAI({
			apiKey: config.apiKey,
		});
		this.systemPrompt = config.systemPrompt;
		this.model = config.model ?? "gpt-4.1";
		this.temperature = config.temperature ?? 0.7;

		config.tools?.forEach((tool) => this.tools.set(tool.name, tool));
	}

	async chat(
		message: string,
		conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [],
	): Promise<string> {
		const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
			{ role: "system", content: this.systemPrompt },
			...conversationHistory,
			{ role: "user", content: message },
		];

		const tools = Array.from(this.tools.values()).map((tool) => ({
			type: "function" as const,
			function: {
				name: tool.name,
				description: tool.description,
				parameters: tool.parameters,
			},
		}));

		while (true) {
			const completion = await this.openai.chat.completions.create({
				model: this.model,
				messages,
				tools: tools.length > 0 ? tools : undefined,
				temperature: this.temperature,
			});

			const response = completion.choices[0]?.message;
			if (!response) {
				throw new Error("No response from OpenAI");
			}

			if (response.tool_calls && response.tool_calls.length > 0) {
				const toolResults = await this.handleToolCalls(response.tool_calls);

				messages.push(
					response,
					...toolResults.map((result) => ({
						role: "tool" as const,
						tool_call_id: result.tool_call_id,
						content: JSON.stringify(result.output),
					})),
				);
			}

			if (completion.choices[0].finish_reason === "stop") {
				return response.content ?? "No content returned";
			}
		}
	}

	private async handleToolCalls(toolCalls: ToolCall[]): Promise<ToolResult[]> {
		const results: ToolResult[] = [];

		for (const toolCall of toolCalls) {
			const tool = this.tools.get(toolCall.function.name);
			if (!tool) {
				results.push({
					tool_call_id: toolCall.id,
					output: { error: `Tool ${toolCall.function.name} not found` },
				});
				continue;
			}

			try {
				const args = JSON.parse(toolCall.function.arguments);
				const output = await tool.handler(args);
				results.push({
					tool_call_id: toolCall.id,
					output,
				});
			} catch (error) {
				results.push({
					tool_call_id: toolCall.id,
					output: {
						error: error instanceof Error ? error.message : "Unknown error",
					},
				});
			}
		}
		return results;
	}
}
