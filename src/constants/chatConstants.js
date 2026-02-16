import { MenuBook, Psychology, Science, School } from "@mui/icons-material";

export const subjects = [
	{ label: "Mathematics", icon: <School fontSize="small" /> },
	{ label: "Science", icon: <Science fontSize="small" /> },
	{ label: "Psychology", icon: <Psychology fontSize="small" /> },
	{ label: "Literature", icon: <MenuBook fontSize="small" /> },
];

export const quickPrompts = [
	"Explain photosynthesis in 3 steps.",
	"Help me plan a study schedule for calculus.",
	"Teach me the basics of cognitive biases.",
	"Summarize the causes of World War I.",
];

export const getWelcomeMessage = () => ({
	id: "welcome",
	role: "assistant",
	content:
		"Hi! I am SolveWise — your learning companion. Tell me what you want to learn, and I will create a clear, step-by-step path with examples and practice.",
	time: new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	}),
});
