import {
	Card,
	CopyButton,
	Text,
	Stack,
	Button,
	Group,
	Avatar,
	ActionIcon,
	Title,
} from "@mantine/core";
import { IconCheck, IconCopy, IconWallet } from "@tabler/icons-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import TokenBalance from "./TokenBalance";

function CardWallet() {
	const { open: openConnection } = useWeb3Modal();
	const { address, status } = useAccount();

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack>
				<Group>
					<Avatar
						src="https://cdn-icons-png.flaticon.com/512/6826/6826311.png"
						radius="xl"
						color="dark"
						bg=""
					></Avatar>
					<Stack spacing={4}>
						<Title order={3} size="lg" transform="uppercase">
							Crypto Wallet
						</Title>
					</Stack>
				</Group>
				{status === "connected" && (
					<Stack>
						<Group spacing="xs" align="flex-start">
							<Text>
								Address:{" "}
								<Text span size="sm" fw="bold" color="gray.8">
									{address}
								</Text>
							</Text>
							<CopyButton value={address}>
								{({ copied, copy }) => (
									<ActionIcon onClick={copy}>
										{copied ? (
											<IconCheck size="1rem" />
										) : (
											<IconCopy size="1rem" />
										)}
									</ActionIcon>
								)}
							</CopyButton>
						</Group>
						<TokenBalance address={address} />
					</Stack>
				)}
				{status === "disconnected" && (
					<Group position="center">
						<Button
							leftIcon={<IconWallet size="1rem" />}
							onClick={() => openConnection()}
							variant="filled"
							color="dark"
							size="xs"
						>
							Connect wallet
						</Button>
					</Group>
				)}
			</Stack>
		</Card>
	);
}

export default CardWallet;
