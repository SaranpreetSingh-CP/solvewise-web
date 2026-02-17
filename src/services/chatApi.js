export const sendMessageToChatAPI = async ({ sessionId, topic, message }) => {
	const payload = {
		sessionId,
		message,
		...(topic ? { topic } : {}),
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
		Array.isArray(data.concepts) &&
		Array.isArray(data.examples);
	const isPractice =
		data &&
		typeof data === "object" &&
		(data.type === "practice" || data.type === undefined) &&
		typeof data.final_answer === "string" &&
		Array.isArray(data.steps) &&
		typeof data.explanation === "string";

	if (!isLesson && !isPractice) {
		throw new Error("Invalid response format from server.");
	}

	return data;
};
