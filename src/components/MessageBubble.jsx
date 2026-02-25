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
	const isHtmlLike = (value) => /<\/?[a-z][\s\S]*>/i.test(value);
	const isHtmlString = typeof content === "string" && isHtmlLike(content);
	let parsedPayload = content;

	if (content && typeof content === "object") {
		parsedPayload = content;
	} else if (!isHtmlString) {
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
	const isPending = isObjectPayload && parsedPayload.type === "pending";
	const isStreaming =
		isObjectPayload &&
		(parsedPayload.type === "streaming" || parsedPayload.type === "final");
	const isPractice =
		isObjectPayload &&
		(parsedPayload.type === "practice" ||
			typeof parsedPayload.final_answer === "string" ||
			Array.isArray(parsedPayload.steps) ||
			typeof parsedPayload.explanation === "string");
	const steps =
		isPractice && Array.isArray(parsedPayload.steps) ? parsedPayload.steps : [];
	const htmlContent =
		typeof parsedPayload === "string" && isHtmlLike(parsedPayload)
			? parsedPayload
			: null;
	const streamingContent = isStreaming ? parsedPayload.content || "" : "";
	const streamingHtml =
		isStreaming &&
		typeof streamingContent === "string" &&
		isHtmlLike(streamingContent)
			? streamingContent
			: null;
	const HtmlBlock = ({ html }) => (
		<Typography
			variant="body1"
			component="div"
			sx={{
				whiteSpace: "normal",
				color: "inherit",
				"& p": { m: 0, mb: 1.2, lineHeight: 1.6 },
				"& ul, & ol": { pl: 2.8, m: 0, mb: 1.2 },
				"& li": { mb: 0.6, lineHeight: 1.6 },
				"& ul li::marker, & ol li::marker": { color: "#64748b" },
				"& h1": { m: 0, mb: 1, fontSize: "1.25rem", fontWeight: 700 },
				"& h2": {
					m: 0,
					mb: 1,
					fontSize: "1.15rem",
					fontWeight: 700,
					borderBottom: "1px solid #e2e8f0",
					paddingBottom: "0.3rem",
				},
				"& h3": { m: 0, mb: 0.9, fontSize: "1.05rem", fontWeight: 700 },
				"& h4": {
					m: 0,
					mb: 0.7,
					fontSize: "0.95rem",
					fontWeight: 700,
					textTransform: "uppercase",
					letterSpacing: "0.04em",
					color: "#64748b",
				},
				"& h5, & h6": { m: 0, mb: 0.6, fontWeight: 600 },
				"& strong": { fontWeight: 700 },
				"& hr": {
					border: 0,
					borderTop: "1px solid #e2e8f0",
					margin: "0.75rem 0",
				},
				"& blockquote": {
					m: 0,
					mb: 1.2,
					padding: "0.6rem 0.9rem",
					borderLeft: "3px solid #93c5fd",
					backgroundColor: "rgba(147, 197, 253, 0.12)",
					color: "#1e3a8a",
				},
				"& code": {
					fontFamily:
						"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
					fontSize: "0.95em",
					backgroundColor: "rgba(15, 23, 42, 0.06)",
					padding: "0.1em 0.25em",
					borderRadius: 4,
				},
				"& pre": {
					m: 0,
					mb: 1.2,
					padding: "0.75rem 0.9rem",
					backgroundColor: "rgba(15, 23, 42, 0.06)",
					borderRadius: 8,
					overflowX: "auto",
				},
				"& table": {
					width: "100%",
					borderCollapse: "collapse",
					marginBottom: "1.2rem",
				},
				"& th, & td": {
					border: "1px solid #e2e8f0",
					padding: "0.4rem 0.6rem",
					textAlign: "left",
				},
				"& th": {
					backgroundColor: "rgba(148, 163, 184, 0.12)",
					fontWeight: 600,
				},
				"& .sw-response": {
					fontFamily: '"IBM Plex Sans", system-ui, -apple-system, sans-serif',
					color: "#1c1b1a",
					background:
						"radial-gradient(120% 120% at 0% 0%, #fff7ea 0%, #f5f1ea 50%, #f3efe8 100%)",
					border: "1px solid #e9e2d8",
					borderRadius: "20px",
					padding: "22px 24px",
					boxShadow: "0 16px 40px rgba(31, 24, 18, 0.12)",
					lineHeight: 1.55,
				},
				"& .sw-block": {
					background: "#ffffff",
					border: "1px solid #e9e2d8",
					borderRadius: "14px",
					padding: "14px 16px",
					margin: "12px 0",
				},
				"& .sw-label": {
					fontFamily: '"Fraunces", serif',
					fontWeight: 600,
					fontSize: "0.85rem",
					letterSpacing: "0.04em",
					textTransform: "uppercase",
					color: "#6a635c",
					marginBottom: "0.5rem",
				},
				"& .sw-value": {
					fontSize: "1.05rem",
					fontWeight: 600,
				},
				"& .sw-list, & .sw-steps": {
					margin: "0.5rem 0 0 1.2rem",
					padding: 0,
				},
				"& .sw-list li, & .sw-steps li": {
					margin: "0.35rem 0",
				},
				"& .sw-example": {
					background: "#e7f2ef",
					border: "1px dashed #cfe5df",
					borderRadius: "12px",
					padding: "12px 14px",
					margin: "10px 0 6px",
				},
				"& .sw-problem": {
					fontWeight: 600,
					color: "#1f3c37",
					marginBottom: "0.4rem",
				},
				"& .sw-answer": {
					marginTop: "0.5rem",
					padding: "10px 12px",
					borderRadius: "10px",
					background: "#fef8ed",
					border: "1px solid #f2e1c5",
					fontWeight: 600,
				},
				"& .sw-answer strong": {
					color: "#8b5a1e",
				},
				"@media (max-width: 640px)": {
					"& .sw-response": { padding: "16px", borderRadius: "16px" },
					"& .sw-block": { padding: "12px" },
				},
			}}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);

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
					{!isUser && isPending ? (
						<Typography variant="body1" color="#94a3b8">
							Thinking...
						</Typography>
					) : !isUser && isStreaming ? (
						streamingHtml ? (
							<HtmlBlock html={streamingHtml} />
						) : (
							<Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
								{streamingContent}
							</Typography>
						)
					) : !isUser && isLesson ? (
						<Box display="flex" flexDirection="column" gap={2}>
							<Box>
								<Typography variant="subtitle2" color="#64748b">
									Topic
								</Typography>
								<Typography variant="h6" fontWeight={700}>
									{parsedPayload.topic}
								</Typography>
							</Box>
							{parsedPayload.difficulty && (
								<Box>
									<Typography variant="subtitle2" color="#64748b">
										Difficulty
									</Typography>
									<Typography variant="body1">
										{parsedPayload.difficulty}
									</Typography>
								</Box>
							)}
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
						</Box>
					) : htmlContent ? (
						<HtmlBlock html={htmlContent} />
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
