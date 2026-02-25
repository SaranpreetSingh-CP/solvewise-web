import { useEffect, useRef } from "react";

import { Avatar, Box, Chip, CircularProgress, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import {
	BrandBadge,
	ChatArea,
	Header,
	MessageBubble as StyledMessageBubble,
	MessageRow,
	Messages,
	Page,
	Shell,
	Sidebar,
} from "../styles/chatStyles";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

function ChatWindow({ history, isTyping, onSend }) {
	const bottomRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [history, isTyping]);

	return (
		<Page>
			<Shell>
				<Sidebar>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="space-between"
					>
						<BrandBadge>
							<Avatar sx={{ bgcolor: "#3b82f6" }}>
								<AutoAwesome />
							</Avatar>
							<Box>
								<Typography variant="h6" fontWeight={700}>
									SolveWise
								</Typography>
								<Typography variant="body2" color="rgba(226,232,240,0.7)">
									Learning Chatbot
								</Typography>
							</Box>
						</BrandBadge>
					</Box>
				</Sidebar>

				<ChatArea>
					<Header>
						<Box>
							<Typography variant="h6" fontWeight={700} color="#0f172a">
								Personalized Learning Chat
							</Typography>
							<Typography variant="body2" color="#64748b">
								Get structured explanations, examples, and practice.
							</Typography>
							<Typography variant="subtitle2" color="#64748b" sx={{ mt: 0.5 }}>
								Start by typing a math topic (e.g., fractions).
							</Typography>
						</Box>
						<Box display="flex" alignItems="center" gap={1}>
							<Chip label="Online" color="success" size="small" />
							<Chip label="Model: Tutor" size="small" variant="outlined" />
						</Box>
					</Header>

					<Messages>
						{history.map((item, index) => (
							<Box
								key={item.id ?? `${item.userQuestion}-${index}`}
								display="flex"
								flexDirection="column"
								gap={2}
							>
								<MessageBubble role="user" content={item.userQuestion} />
								<MessageBubble role="assistant" content={item.tutorResponse} />
							</Box>
						))}

						<div ref={bottomRef} />
					</Messages>

					<ChatInput onSend={onSend} disabled={isTyping} />
				</ChatArea>
			</Shell>
		</Page>
	);
}

export default ChatWindow;
