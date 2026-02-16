/**
 * Create MessageBubble component:
 *
 * Props:
 * - role ("user" or "assistant")
 * - content (string)
 *
 * UI behavior:
 * - User messages aligned right
 * - Assistant messages aligned left
 * - Simple styling (no complex CSS yet)
 */

import { Avatar, Box, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import {
	MessageBubble as StyledMessageBubble,
	MessageRow,
} from "../styles/chatStyles";

function MessageBubble({ role, content, time }) {
	const isUser = role === "user";

	return (
		<MessageRow $role={role}>
			{!isUser && (
				<Avatar sx={{ bgcolor: "#2563eb", width: 34, height: 34 }}>
					<AutoAwesome fontSize="small" />
				</Avatar>
			)}
			<Box
				display="flex"
				flexDirection="column"
				gap={0.5}
				alignItems={isUser ? "flex-end" : "flex-start"}
			>
				<StyledMessageBubble $role={role}>
					<Typography variant="body1">{content}</Typography>
				</StyledMessageBubble>
				{time && (
					<Typography variant="caption" color="#94a3b8">
						{time}
					</Typography>
				)}
			</Box>
			{isUser && (
				<Avatar sx={{ bgcolor: "#0f172a", width: 34, height: 34 }}>U</Avatar>
			)}
		</MessageRow>
	);
}

export default MessageBubble;
