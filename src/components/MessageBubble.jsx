import { Avatar, Box, Stack, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import {
	MessageBubble as StyledMessageBubble,
	MessageRow,
} from "../styles/chatStyles";

/**
 * Update MessageBubble to render structured tutorResponse:
 *
 * If is_math_question === false:
 *   - Display simple warning message
 *
 * If true:
 *   - Display steps as ordered list
 *   - Display final_answer clearly highlighted
 *   - Display explanation below
 *
 * Do NOT render raw JSON.
 */

/**
 * Render steps like:
 *
 * <ol>
 *   {steps.map((step, index) => (
 *     <li key={index}>{step}</li>
 *   ))}
 * </ol>
 *
 * Show final answer bold:
 * <strong>{final_answer}</strong>
 */

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
	const isObjectPayload = parsedPayload && typeof parsedPayload === "object";
	const isLesson = isObjectPayload && parsedPayload.type === "lesson";
	const isError = isObjectPayload && parsedPayload.type === "error";
	const isPractice =
		isObjectPayload &&
		(parsedPayload.type === "practice" ||
			typeof parsedPayload.final_answer === "string" ||
			Array.isArray(parsedPayload.steps) ||
			typeof parsedPayload.explanation === "string");
	const steps =
		isPractice && Array.isArray(parsedPayload.steps) ? parsedPayload.steps : [];

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
					{!isUser && isLesson ? (
						<Box display="flex" flexDirection="column" gap={2}>
							<Box>
								<Typography variant="subtitle2" color="#64748b">
									Topic
								</Typography>
								<Typography variant="h6" fontWeight={700}>
									{parsedPayload.topic}
								</Typography>
							</Box>
							{Array.isArray(parsedPayload.concepts) &&
								parsedPayload.concepts.length > 0 && (
									<Box>
										<Typography variant="subtitle2" color="#64748b">
											Concepts
										</Typography>
										<Box component="ul" sx={{ pl: 2, m: 0 }}>
											{parsedPayload.concepts.map((concept, index) => (
												<Box
													key={`${concept}-${index}`}
													component="li"
													sx={{ mb: 0.5 }}
												>
													<Typography variant="body1">{concept}</Typography>
												</Box>
											))}
										</Box>
									</Box>
								)}
							{Array.isArray(parsedPayload.examples) &&
								parsedPayload.examples.length > 0 && (
									<Box>
										<Typography variant="subtitle2" color="#64748b">
											Examples
										</Typography>
										<Stack spacing={1.5} sx={{ mt: 0.5 }}>
											{parsedPayload.examples.map((example, index) => (
												<Box key={`${example.problem}-${index}`}>
													<Typography variant="body1" fontWeight={600}>
														{example.problem}
													</Typography>
													{Array.isArray(example.steps) &&
														example.steps.length > 0 && (
															<Box component="ol" sx={{ pl: 2, m: 0, mt: 0.5 }}>
																{example.steps.map((step, stepIndex) => (
																	<Box
																		key={`${step}-${stepIndex}`}
																		component="li"
																		sx={{ mb: 0.25 }}
																	>
																		<Typography variant="body2">
																			{step}
																		</Typography>
																	</Box>
																))}
															</Box>
														)}
													{example.final_answer && (
														<Typography variant="body2" sx={{ mt: 0.5 }}>
															Final answer:{" "}
															<strong>{example.final_answer}</strong>
														</Typography>
													)}
												</Box>
											))}
										</Stack>
									</Box>
								)}
						</Box>
					) : !isUser && isError ? (
						<Typography variant="body1" color="#ef4444">
							{parsedPayload.explanation}
						</Typography>
					) : !isUser && isPractice ? (
						<Box display="flex" flexDirection="column" gap={1.5}>
							{parsedPayload.final_answer && (
								<Box>
									<Typography variant="subtitle2" color="#64748b">
										Answer
									</Typography>
									<Typography variant="h6" fontWeight={700}>
										<strong>{parsedPayload.final_answer}</strong>
									</Typography>
								</Box>
							)}
							{steps.length > 0 && (
								<Box>
									<Typography variant="subtitle2" color="#64748b">
										Steps
									</Typography>
									<Box component="ol" sx={{ pl: 2, m: 0 }}>
										{steps.map((step, index) => (
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
