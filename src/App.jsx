/**
 * Generate a unique sessionId using uuid.
 * Include sessionId in every API request.
 */

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatWindow from "./components/ChatWindow";
import { sendMessageToChatAPI } from "./services/chatApi";

function App() {
	const [history, setHistory] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [sessionId] = useState(uuidv4());

	const handleSend = async (messageText) => {
		if (!messageText?.trim()) return;
		const messageId = `msg-${Date.now()}`;
		const question = messageText.trim();
		setHistory((prev) => [
			...prev,
			{
				id: messageId,
				userQuestion: question,
				tutorResponse: { type: "pending" },
			},
		]);

		setIsTyping(true);

		try {
			const data = await sendMessageToChatAPI({
				sessionId,
				message: question,
			});
			setHistory((prev) =>
				prev.map((item) =>
					item.id === messageId ? { ...item, tutorResponse: data } : item,
				),
			);
		} catch (error) {
			setHistory((prev) =>
				prev.map((item) =>
					item.id === messageId
						? {
								...item,
								tutorResponse: {
									type: "error",
									explanation:
										typeof error?.message === "string"
											? error.message
											: "Sorry, I couldn't reach the server.",
								},
							}
						: item,
				),
			);
		} finally {
			setIsTyping(false);
		}
	};

	return (
		<ChatWindow history={history} isTyping={isTyping} onSend={handleSend} />
	);
}

export default App;
