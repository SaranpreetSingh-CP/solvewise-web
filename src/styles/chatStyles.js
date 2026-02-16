import styled from "styled-components";
import { Chip } from "@mui/material";

export const Page = styled.div`
	min-height: 100vh;
	background: radial-gradient(
		circle at top,
		#eaf2ff 0%,
		#f4f7fb 45%,
		#eef2f7 100%
	);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
`;

export const Shell = styled.div`
	width: min(1200px, 100%);
	height: min(86vh, 920px);
	background: #ffffff;
	border-radius: 28px;
	overflow: hidden;
	box-shadow: 0 30px 80px rgba(23, 32, 54, 0.15);
	display: grid;
	grid-template-columns: 300px 1fr;

	@media (max-width: 960px) {
		grid-template-columns: 1fr;
		height: auto;
	}
`;

export const Sidebar = styled.div`
	background: linear-gradient(165deg, #1e293b 0%, #0f172a 100%);
	color: #fff;
	padding: 28px 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

export const BrandBadge = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ChatArea = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #f8fafc;
`;

export const Header = styled.div`
	padding: 22px 28px 16px;
	background: #ffffff;
	border-bottom: 1px solid #e2e8f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`;

export const Messages = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 24px 28px;
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

export const MessageRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	justify-content: ${({ $role }) =>
		$role === "user" ? "flex-end" : "flex-start"};
`;

export const MessageBubble = styled.div`
	max-width: min(560px, 85%);
	padding: 14px 18px;
	border-radius: 18px;
	line-height: 1.5;
	box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
	background: ${({ $role }) => ($role === "user" ? "#2563eb" : "#ffffff")};
	color: ${({ $role }) => ($role === "user" ? "#f8fafc" : "#0f172a")};
	border: ${({ $role }) => ($role === "user" ? "none" : "1px solid #e2e8f0")};
`;

export const InputArea = styled.div`
	padding: 18px 28px 24px;
	background: #ffffff;
	border-top: 1px solid #e2e8f0;
`;

export const StyledChip = styled(Chip)`
	&& {
		background: rgba(148, 163, 184, 0.2);
		color: #e2e8f0;
		border: 1px solid rgba(148, 163, 184, 0.3);
	}

	&& .MuiChip-label,
	&& .MuiChip-icon {
		color: #e2e8f0;
	}

	&:hover {
		background: rgba(148, 163, 184, 0.35);
	}
`;
