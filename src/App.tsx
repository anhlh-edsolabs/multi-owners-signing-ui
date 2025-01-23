import { useEffect, useState } from "react";

import { Container, Grid, Space, Stack } from "@mantine/core";
import { useAppKitAccount } from "@reown/appkit/react";
import { getWalletClient } from "@wagmi/core";

import { wagmiConfig } from "./common/config";

import Constants from "./common/constants";

import CardWallet from "./components/cards/CardWallet";
import CardERC20Token from "./components/cards/CardERC20Token";
import CardSoftStakingContract from "./components/cards/CardSoftStakingContract";
import CardCombineSignatures from "./components/cards/CardCombineSignatures";

import { useConnectedChain } from "./hooks/useConnectedChain";

import { useChainConnectionStore } from "./hooks/stores/useChainConnectionStore";

export default function App() {
	const { status } = useAppKitAccount();
	const [targetChainConnected, setTargetChainConnected] = useState(false);
	const { connectedChain } = useChainConnectionStore();

	const defaultNetworkId = Number(Constants.DEFAULT_NETWORK_ID);

	useConnectedChain();

	useEffect(() => {
		const switchToDefaultNetwork = async () => {
			if (status === "connected") {
				try {
					const client = await getWalletClient(wagmiConfig);

					if (client.chain.id !== defaultNetworkId) {
						console.log(
							`Switching to default network with id ${defaultNetworkId}...`,
						);

						await client.switchChain({
							id: defaultNetworkId,
						});
					} 
					setTargetChainConnected(true);
				} catch (error) {
					console.error("Error getting wallet client:", error);
				}
			} else {
				setTargetChainConnected(false);
			}
		};
		switchToDefaultNetwork();
	}, [status, connectedChain, defaultNetworkId]);

	return (
		<Container my="md" size="lg">
			<Grid align="stretch">
				<Grid.Col sm={12} md={6}>
					<CardWallet />
				</Grid.Col>
				<Grid.Col sm={12} md={6}>
					<CardERC20Token />
				</Grid.Col>
			</Grid>

			{status === "connected" && targetChainConnected && (
				<>
					<Space h="md" />
					<Stack>
						<CardSoftStakingContract />
					</Stack>
					<Space h="md" />
					<Stack>
						<CardCombineSignatures />
					</Stack>
				</>
			)}
		</Container>
	);
}
