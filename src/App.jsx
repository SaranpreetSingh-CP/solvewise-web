import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import { getWelcomeMessage } from "./constants/chatConstants";
import { sendMessageToChatAPI } from "./services/chatApi";

function App() {
	const [messages, setMessages] = useState([getWelcomeMessage()]);
	const [isTyping, setIsTyping] = useState(false);

	const handleSend = async (messageText) => {
		if (!messageText?.trim()) return;

		const userMessage = {
			id: `user-${Date.now()}`,
			role: "user",
			content: messageText.trim(),
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsTyping(true);

		try {
			const data = await sendMessageToChatAPI(messageText);
			debugger;
			const hasStructuredAnswer =
				data &&
				(typeof data.final_answer === "string" ||
					Array.isArray(data.steps) ||
					typeof data.explanation === "string");
			const reply = hasStructuredAnswer
				? data
				: data?.reply ||
					data?.message ||
					data?.content ||
					"I received your message, but I couldn't parse a response.";

			const assistantMessage = {
				id: `assistant-${Date.now()}`,
				role: "assistant",
				content: reply,
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			debugger;
			const errorMessage = {
				id: `assistant-error-${Date.now()}`,
				role: "assistant",
				content: error,
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};

			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsTyping(false);
		}
	};

	return (
		<ChatWindow messages={messages} isTyping={isTyping} onSend={handleSend} />
	);
}

export default App;
