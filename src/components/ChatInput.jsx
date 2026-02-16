import { useState } from "react";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import { InputArea } from "../styles/chatStyles";

function ChatInput({ onSend, disabled }) {
	const [inputValue, setInputValue] = useState("");
	const canSend = inputValue.trim().length > 0 && !disabled;

	const handleSend = () => {
		const trimmed = inputValue.trim();
		if (!trimmed) return;
		onSend(trimmed);
		setInputValue("");
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (canSend) handleSend();
		}
	};

	return (
		<InputArea>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={1.5}
				alignItems="center"
			>
				<TextField
					fullWidth
					multiline
					minRows={2}
					maxRows={4}
					placeholder="Ask me about any subject, topic, or study plan..."
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
					onKeyDown={handleKeyDown}
					disabled={disabled}
				/>
				<IconButton
					color="primary"
					size="large"
					onClick={handleSend}
					disabled={!canSend}
					sx={{
						bgcolor: "#2563eb",
						color: "#fff",
						"&:hover": { bgcolor: "#1d4ed8" },
						"&.Mui-disabled": { bgcolor: "#cbd5f5", color: "#fff" },
					}}
				>
					<Send />
				</IconButton>
			</Stack>
			<Box
				mt={1}
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Typography variant="caption" color="#94a3b8">
					Press Enter to send • Shift + Enter for a new line
				</Typography>
				<Typography variant="caption" color="#94a3b8">
					API flow: ready
				</Typography>
			</Box>
		</InputArea>
	);
}

export default ChatInput;
