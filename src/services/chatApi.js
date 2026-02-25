export const sendMessageToChatAPI = async ({ sessionId, message }) => {
	const payload = {
		sessionId,
		message,
	};

	const endpoint = "http://localhost:3000/chat";

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		let errorMessage = `Request failed with status ${response.status}`;
		try {
			const errorData = await response.json();
			if (typeof errorData?.error === "string") {
				errorMessage = errorData.error;
			}
		} catch (error) {
			// ignore parse errors and keep default message
		}
		throw new Error(errorMessage);
	}

	const data = await response.json();
	const isLesson =
		data &&
		typeof data === "object" &&
		data.type === "lesson" &&
		typeof data.topic === "string" &&
		typeof data.difficulty === "string" &&
		Array.isArray(data.concepts) &&
		Array.isArray(data.examples);
	const isPractice =
		data &&
		typeof data === "object" &&
		(data.type === "practice" || data.type === undefined) &&
		typeof data.final_answer === "string" &&
		Array.isArray(data.steps);

	if (!isLesson && !isPractice) {
		throw new Error("Invalid response format from server.");
	}

	return data;
};

const parseSsePayload = (rawValue) => {
	if (!rawValue) return "";
	try {
		return JSON.parse(rawValue);
	} catch (error) {
		return rawValue;
	}
};

const processSseBuffer = (buffer, handlers) => {
	const normalized = buffer.replace(/\r\n/g, "\n");
	const blocks = normalized.split(/\n\n/);
	const remaining = blocks.pop() ?? "";

	for (const block of blocks) {
		const trimmed = block.trim();
		if (!trimmed) continue;

		const lines = trimmed.split(/\n/);
		let eventName = "message";
		const dataLines = [];

		for (const line of lines) {
			if (!line || line.startsWith(":")) continue;
			if (line.startsWith("event:")) {
				eventName = line.slice("event:".length).trim();
				continue;
			}
			if (line.startsWith("data:")) {
				dataLines.push(line.slice("data:".length).replace(/^\s/, ""));
			}
		}

		const dataValue = dataLines.join("\n");
		const payload = parseSsePayload(dataValue);
		switch (eventName) {
			case "meta":
				handlers.onMeta?.(payload);
				break;
			case "chunk":
				handlers.onChunk?.(payload);
				break;
			case "done":
				handlers.onDone?.(payload);
				return { shouldStop: true };
			case "error":
				handlers.onError?.(payload);
				return { shouldStop: true };
			default:
				break;
		}
	}

	return { remaining, shouldStop: false };
};

export const streamChat = async ({
	sessionId,
	message,
	onMeta,
	onChunk,
	onDone,
	onError,
	signal,
}) => {
	const payload = {
		sessionId,
		message,
	};

	const endpoint = "http://localhost:3000/chat";

	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "text/event-stream",
		},
		body: JSON.stringify(payload),
		signal,
	});

	if (!response.ok) {
		let errorMessage = `Request failed with status ${response.status}`;
		try {
			const errorData = await response.json();
			if (typeof errorData?.error === "string") {
				errorMessage = errorData.error;
			}
		} catch (error) {
			// ignore parse errors and keep default message
		}
		throw new Error(errorMessage);
	}

	if (!response.body) {
		throw new Error("Response body is empty.");
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let shouldStop = false;

	while (!shouldStop) {
		const { value, done } = await reader.read();
		if (done) break;
		const text = decoder.decode(value, { stream: true });
		const result = processSseBuffer(buffer + text, {
			onMeta,
			onChunk,
			onDone,
			onError,
		});
		buffer = result.remaining ?? "";
		shouldStop = Boolean(result.shouldStop);
	}

	if (buffer.trim()) {
		processSseBuffer(buffer + "\n\n", {
			onMeta,
			onChunk,
			onDone,
			onError,
		});
	}
};
