import {
	Card,
	Stack,
	Group,
	Title,
	Text,
	Avatar,
	ActionIcon,
} from "@mantine/core";
import { useAccount } from "wagmi";
import TokenBalance from "./TokenBalance";
// import ButtonTransfer from "./buttons/ButtonTransfer";
import { sepolia } from "wagmi/chains";
import { IconExternalLink } from "@tabler/icons-react";

const token = import.meta.env.VITE_WUSD_TOKEN_ADDRESS!;

function CardERC20Token() {
	// const { open: openConnection } = useWeb3Modal();
	const { address, status } = useAccount();

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack>
				<Group>
					{/* <Title transform="uppercase" order={3}>WUSD Token</Title> */}
					<Avatar
						src="https://frontend-stg.swapflow.io/images/WUSD.png"
						radius="xl"
						color="dark"
						bg=""
					></Avatar>
					<Stack spacing={4}>
						<Title order={3} size="lg" transform="uppercase">
							WUSD Token
						</Title>
					</Stack>
				</Group>
				<Stack>
					<Group spacing="xs" align="flex-start">
						<Text>
							Address:{" "}
							<Text span size="sm" fw="bold" color="gray.8">
								{token}
							</Text>
						</Text>
						<ActionIcon
							onClick={() =>
								window.open(
									`${sepolia.blockExplorers.default.url}/address/${token}`,
								)
							}
						>
							<IconExternalLink size="1rem"></IconExternalLink>
						</ActionIcon>
					</Group>
					{status === "connected" && (
						<TokenBalance address={address} token={token} />
					)}
				</Stack>
			</Stack>
		</Card>
	);
}

export default CardERC20Token;
