/**
 * Create a minimal chat application:
 *
 * Requirements:
 * - Maintain messages state as array
 *   Each message should have:
 *   { role: "user" | "assistant", content: string }
 *
 * - Render list of messages
 * - Include ChatInput component
 * - On send:
 *    1. Add user message immediately
 *    2. Call sendMessageToChatAPI
 *    3. Add assistant response
 *    4. Handle loading state
 *    5. Handle errors
 */

/**
 * Add loading state:
 * - While waiting for API response:
 *    Disable input
 *    Show "Typing..." message
 * - Remove typing indicator when response arrives
 */

import { useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import { getWelcomeMessage } from "./constants/chatConstants";
import { sendMessageToApi } from "./services/chatApi";

function App() {
	const [messages, setMessages] = useState([getWelcomeMessage()]);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const bottomRef = useRef(null);

	const canSend = useMemo(
		() => input.trim().length > 0 && !isTyping,
		[input, isTyping],
	);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages, isTyping]);

	const handleSend = async (prompt) => {
		const messageText = prompt ?? input;
		if (!messageText.trim()) return;

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
		setInput("");
		setIsTyping(true);

		const reply = await sendMessageToApi(messageText);

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
		setIsTyping(false);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (canSend) handleSend();
		}
	};

	return (
		<ChatWindow
			messages={messages}
			isTyping={isTyping}
			onSend={handleSend}
			inputValue={input}
			onInputChange={(event) => setInput(event.target.value)}
			onKeyDown={handleKeyDown}
			canSend={canSend}
			bottomRef={bottomRef}
		/>
	);
}

export default App;
