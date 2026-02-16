/**
 * Auto-scroll chat window to bottom
 * whenever messages update
 */

import {
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
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
	StyledChip,
} from "../styles/chatStyles";
import { quickPrompts, subjects } from "../constants/chatConstants";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

function ChatWindow({
	messages,
	isTyping,
	onSend,
	inputValue,
	onInputChange,
	onKeyDown,
	canSend,
	bottomRef,
}) {
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

					<Box>
						<Typography variant="subtitle1" fontWeight={600} gutterBottom>
							Subjects
						</Typography>
						<Stack spacing={1.2}>
							{subjects.map((subject) => (
								<Button
									key={subject.label}
									variant="outlined"
									color="inherit"
									startIcon={subject.icon}
									onClick={() =>
										onSend(`Teach me ${subject.label.toLowerCase()}.`)
									}
									sx={{
										justifyContent: "flex-start",
										borderColor: "rgba(148,163,184,0.35)",
										color: "#e2e8f0",
										textTransform: "none",
										"&:hover": {
											borderColor: "#38bdf8",
											background: "rgba(56,189,248,0.1)",
										},
									}}
								>
									{subject.label}
								</Button>
							))}
						</Stack>
					</Box>

					<Divider sx={{ borderColor: "rgba(148,163,184,0.2)" }} />

					<Box>
						<Typography variant="subtitle1" fontWeight={600} gutterBottom>
							Quick prompts
						</Typography>
						<Stack spacing={1}>
							{quickPrompts.map((prompt) => (
								<StyledChip
									key={prompt}
									label={prompt}
									onClick={() => onSend(prompt)}
									variant="outlined"
								/>
							))}
						</Stack>
					</Box>

					<Box mt="auto">
						<Typography variant="caption" color="rgba(226,232,240,0.6)">
							Tip: Ask for summaries, quizzes, or study plans.
						</Typography>
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
						</Box>
						<Box display="flex" alignItems="center" gap={1}>
							<Chip label="Online" color="success" size="small" />
							<Chip label="Model: Tutor" size="small" variant="outlined" />
						</Box>
					</Header>

					<Messages>
						{messages.map((message) => (
							<MessageBubble key={message.id} message={message} />
						))}

						{isTyping && (
							<MessageRow $role="assistant">
								<Avatar sx={{ bgcolor: "#2563eb", width: 34, height: 34 }}>
									<AutoAwesome fontSize="small" />
								</Avatar>
								<StyledMessageBubble $role="assistant">
									<Box display="flex" alignItems="center" gap={1}>
										<CircularProgress size={16} />
										<Typography variant="body2">Thinking...</Typography>
									</Box>
								</StyledMessageBubble>
							</MessageRow>
						)}
						<div ref={bottomRef} />
					</Messages>

					<ChatInput
						value={inputValue}
						onChange={onInputChange}
						onSend={onSend}
						onKeyDown={onKeyDown}
						disabled={isTyping}
						canSend={canSend}
					/>
				</ChatArea>
			</Shell>
		</Page>
	);
}

export default ChatWindow;
