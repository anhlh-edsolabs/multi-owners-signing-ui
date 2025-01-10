import {
	ActionIcon,
	Avatar,
	Card,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useAppKitAccount } from "@reown/appkit/react";

import { IconExternalLink } from "@tabler/icons-react";
import { useConnectedChain } from "../../hooks/useConnectedChain";
import TokenBalance from "../controls/TokenBalance";

const token = import.meta.env.VITE_WUSD_TOKEN_ADDRESS!;

function CardERC20Token() {
	const { address, status } = useAppKitAccount();
	const formattedAddress = address as `0x${string}`;
	const connectedChain = useConnectedChain();

	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack>
				<Group>
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
									`${connectedChain?.blockExplorers?.default.url}/address/${token}`,
								)
							}
						>
							<IconExternalLink size="1rem"></IconExternalLink>
						</ActionIcon>
					</Group>
					{status === "connected" && (
						<TokenBalance
							address={formattedAddress}
							token={token}
						/>
					)}
				</Stack>
			</Stack>
		</Card>
	);
}

export default CardERC20Token;
