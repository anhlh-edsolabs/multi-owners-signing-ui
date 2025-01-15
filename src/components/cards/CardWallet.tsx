import {
	ActionIcon,
	Avatar,
	Button,
	Card,
	CopyButton,
	Group,
	Space,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import {
	useAppKit,
	useAppKitAccount,
	useDisconnect,
} from "@reown/appkit/react";
import { IconCheck, IconCopy, IconWallet } from "@tabler/icons-react";
import TokenBalance from "../controls/TokenBalance";
import { useConnectedChain } from "../../hooks/useConnectedChain"; 

function CardWallet() {
	const { open } = useAppKit();
	const { address, status } = useAppKitAccount();
	const formattedAddress = address as `0x${string}`;
	const { disconnect } = useDisconnect();

	useConnectedChain();

	console.log({ status });
	console.log({ address });

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
					{status === "connected" && (
						<Group grow>
							<Button
								leftIcon={<IconWallet size="1rem" />}
								onClick={() => disconnect()}
								variant="filled"
								color="dark"
								size="xs"
							>
								Disconnect
							</Button>
						</Group>
					)}
					{(status == undefined || status === "disconnected") && (
						<Group position="center">
							<Button
								leftIcon={<IconWallet size="1rem" />}
								onClick={() => open()}
								variant="filled"
								color="dark"
								size="xs"
							>
								Connect wallet
							</Button>
						</Group>
					)}
				</Group>
				{(status == undefined || status === "disconnected") && (
					<Stack>
						<Group spacing="xs" position="center">
							<Text>
								<Text span size="sm" fw="bold" color="gray.8">
									Connect your wallet to access your balances
								</Text>
							</Text>
							<Space h={28} w={40}></Space>
						</Group>
					</Stack>
				)}
				{status === "connected" && (
					<Stack spacing="xs">
						<Group align="flex-start">
							<Text>
								Address:{" "}
								<Text span size="sm" fw="bold" color="gray.8">
									{address}
								</Text>
							</Text>
							<CopyButton value={address as string}>
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
						<TokenBalance address={formattedAddress} />
					</Stack>
				)}
			</Stack>
		</Card>
	);
}

export default CardWallet;
