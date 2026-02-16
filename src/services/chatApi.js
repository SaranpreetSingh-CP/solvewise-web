/**
 * Create a function sendMessageToChatAPI(message)
 *
 * This function should:
 * - Send POST request to http://localhost:5000/chat
 * - Send JSON body { message }
 * - Handle errors properly
 * - Return parsed JSON response
 * - Throw error if response not ok
 */

export const sendMessageToChatAPI = async (message) => {
	const response = await fetch("http://localhost:5000/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message }),
	});

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response.json();
};
