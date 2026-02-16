import { Avatar, Box, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import {
	MessageBubble as StyledMessageBubble,
	MessageRow,
} from "../styles/chatStyles";

function MessageBubble({ role, content, time }) {
	const isUser = role === "user";
	const normalized = String(content ?? "").replace(/\r\n/g, "\n");
	let parsedPayload = content;

	if (content && typeof content === "object") {
		parsedPayload = content;
	} else {
		const trimmed = normalized.trim();
		const tryParse = (value) => {
			try {
				return JSON.parse(value);
			} catch (error) {
				return null;
			}
		};

		parsedPayload = tryParse(trimmed);

		if (!parsedPayload) {
			const start = trimmed.indexOf("{");
			const end = trimmed.lastIndexOf("}");
			if (start !== -1 && end !== -1 && end > start) {
				parsedPayload = tryParse(trimmed.slice(start, end + 1));
			}
		}
	}
	const lines = normalized
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const isNumberedList =
		lines.length > 1 && lines.every((line) => /^\d+[.)]\s+/.test(line));
	const listItems = isNumberedList
		? lines.map((line) => line.replace(/^\d+[.)]\s+/, ""))
		: [];

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
					{parsedPayload?.final_answer || parsedPayload?.explanation ? (
						<Box display="flex" flexDirection="column" gap={1.5}>
							{parsedPayload.final_answer && (
								<Box>
									<Typography variant="subtitle2" color="#64748b">
										Answer
									</Typography>
									<Typography variant="h6" fontWeight={700}>
										{parsedPayload.final_answer}
									</Typography>
								</Box>
							)}
							{parsedPayload.explanation && (
								<Box>
									<Typography variant="subtitle2" color="#64748b">
										Explanation
									</Typography>
									<Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
										{parsedPayload.explanation}
									</Typography>
								</Box>
							)}
							{Array.isArray(parsedPayload.steps) &&
								parsedPayload.steps.length > 0 && (
									<Box>
										<Typography variant="subtitle2" color="#64748b">
											Steps
										</Typography>
										<Box component="ol" sx={{ pl: 2, m: 0 }}>
											{parsedPayload.steps.map((step, index) => (
												<Box
													key={`${step}-${index}`}
													component="li"
													sx={{ mb: 0.5 }}
												>
													<Typography variant="body1">{step}</Typography>
												</Box>
											))}
										</Box>
									</Box>
								)}
						</Box>
					) : isNumberedList ? (
						<Box component="ol" sx={{ pl: 2, m: 0 }}>
							{listItems.map((item, index) => (
								<Box key={`${item}-${index}`} component="li" sx={{ mb: 0.5 }}>
									<Typography variant="body1">{item}</Typography>
								</Box>
							))}
						</Box>
					) : (
						<Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
							{normalized}
						</Typography>
					)}
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
