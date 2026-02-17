/**
 * IMPORTANT:
 * Backend does NOT maintain chat memory.
 * Each request is processed independently.
 *
 * Frontend history is only for display,
 * not sent back to backend.
 */

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatWindow from "./components/ChatWindow";
import { sendMessageToChatAPI } from "./services/chatApi";

/**
 * Refactor state management:
 *
 * - Instead of storing raw chat messages only,
 *   store structured tutor responses.
 *
 * Create state:
 *
 * const [history, setHistory] = useState([]);
 *
 * Each history item should be:
 * {
 *   userQuestion: string,
 *   tutorResponse: {
 *     is_math_question: boolean,
 *     final_answer: string,
 *     steps: string[],
 *     explanation: string
 *   }
 * }
 *
 * Do NOT store assistant text as plain string.
 */

/**
 * Update handleSend:
 *
 * Flow:
 * 1. Capture user input
 * 2. Call sendMessageToChatAPI
 * 3. Receive structured JSON
 * 4. Append to history array
 *
 * Example:
 *
 * setHistory(prev => [
 *   ...prev,
 *   {
 *     userQuestion: inputValue,
 *     tutorResponse: apiResponse
 *   }
 * ]);
 *
 * Clear input after send.
 */

function App() {
	const [history, setHistory] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [sessionId] = useState(uuidv4());
	const [selectedTopic, setSelectedTopic] = useState(null);

	const handleSend = async (messageText) => {
		if (!messageText?.trim()) return;

		if (!selectedTopic) {
			const topic = messageText.trim();
			setIsTyping(true);
			try {
				const data = await sendMessageToChatAPI({
					sessionId,
					topic,
					message: topic,
				});
				setSelectedTopic(topic);
				setHistory((prev) => [
					...prev,
					{
						userQuestion: topic,
						tutorResponse: data,
					},
				]);
			} catch (error) {
				setHistory((prev) => [
					...prev,
					{
						userQuestion: topic,
						tutorResponse: {
							type: "error",
							explanation:
								typeof error?.message === "string"
									? error.message
									: "Sorry, I couldn't reach the server.",
						},
					},
				]);
			} finally {
				setIsTyping(false);
			}
			return;
		}

		setIsTyping(true);

		try {
			const data = await sendMessageToChatAPI({
				sessionId,
				message: messageText,
			});
			setHistory((prev) => [
				...prev,
				{
					userQuestion: messageText.trim(),
					tutorResponse: data,
				},
			]);
		} catch (error) {
			setHistory((prev) => [
				...prev,
				{
					userQuestion: messageText.trim(),
					tutorResponse: {
						type: "error",
						explanation:
							typeof error?.message === "string"
								? error.message
								: "Sorry, I couldn't reach the server.",
					},
				},
			]);
		} finally {
			setIsTyping(false);
		}
	};

	return (
		<ChatWindow
			history={history}
			isTyping={isTyping}
			onSend={handleSend}
			currentTopic={selectedTopic}
		/>
	);
}

export default App;
