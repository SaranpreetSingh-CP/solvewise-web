export const sendMessageToChatAPI = async (message) => {
	const response = await fetch("http://localhost:3000/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message }),
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

	return response.json();
};
