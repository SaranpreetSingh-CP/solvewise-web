/**
 * Generate a unique sessionId using uuid.
 * Include sessionId in every API request.
 */

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatWindow from "./components/ChatWindow";
import { streamChat } from "./services/chatApi";

function App() {
	const [history, setHistory] = useState([]);
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamedText, setStreamedText] = useState("");
	const [sessionId] = useState(uuidv4());
	const abortControllerRef = useRef(null);

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const handleSend = async (messageText) => {
		if (!messageText?.trim()) return;
		abortControllerRef.current?.abort();

		const controller = new AbortController();
		abortControllerRef.current = controller;
		const messageId = `msg-${Date.now()}`;
		const question = messageText.trim();
		let currentText = "";
		let metaPayload = null;
		setHistory((prev) => [
			...prev,
			{
				id: messageId,
				userQuestion: question,
				tutorResponse: { type: "pending" },
			},
		]);
		setStreamedText("");
		setIsStreaming(true);

		try {
			await streamChat({
				sessionId,
				message: question,
				signal: controller.signal,
				onMeta: (payload) => {
					metaPayload = payload;
					setHistory((prev) =>
						prev.map((item) =>
							item.id === messageId
								? {
										...item,
										tutorResponse: {
											type: "streaming",
											content: currentText,
											meta: metaPayload,
										},
									}
								: item,
						),
					);
				},
				onChunk: (chunk) => {
					const textChunk =
						typeof chunk === "string"
							? chunk
							: typeof chunk?.text === "string"
								? chunk.text
								: "";
					currentText += textChunk;
					setStreamedText(currentText);
					setHistory((prev) =>
						prev.map((item) =>
							item.id === messageId
								? {
										...item,
										tutorResponse: {
											type: "streaming",
											content: currentText,
											meta: metaPayload,
										},
									}
								: item,
						),
					);
				},
				onDone: (payload) => {
					setHistory((prev) =>
						prev.map((item) =>
							item.id === messageId
								? {
										...item,
										tutorResponse: {
											type: "final",
											content: currentText,
											meta: metaPayload,
											done: payload,
										},
									}
								: item,
						),
					);
				},
				onError: (payload) => {
					const message =
						payload && typeof payload === "object"
							? payload.error || payload.message
							: payload;
					setHistory((prev) =>
						prev.map((item) =>
							item.id === messageId
								? {
										...item,
										tutorResponse: {
											type: "error",
											explanation:
												typeof message === "string"
													? message
													: "Sorry, something went wrong.",
										},
									}
								: item,
						),
					);
					controller.abort();
				},
			});
		} catch (error) {
			if (error?.name === "AbortError") return;
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
			setIsStreaming(false);
		}
	};

	return (
		<ChatWindow
			history={history}
			isStreaming={isStreaming}
			streamedText={streamedText}
			onSend={handleSend}
		/>
	);
}

export default App;
