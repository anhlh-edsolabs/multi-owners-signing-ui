import { useEffect, useState } from "react";

import { Container, Grid, Space, Stack } from "@mantine/core";
import { useAppKitAccount } from "@reown/appkit/react";
import { getWalletClient } from "@wagmi/core";

import { wagmiConfig as config } from "./common/config";

import Constants from "./common/constants";

import CardERC20Token from "./components/cards/CardERC20Token";
import CardSoftStakingContract from "./components/cards/CardSoftStakingContract";
import CardWallet from "./components/cards/CardWallet";
import CardCombineSignatures from "./components/cards/CardCombineSignatures";

import { useConnectedChain } from "./hooks/useConnectedChain";

import { useChainConnectionStore } from "./hooks/stores/useChainConnectionStore";

export default function App() {
	const { status } = useAppKitAccount();
	const [isTargetChainConnected, setTargetChainConnected] = useState(false);
	const { connectedChain } = useChainConnectionStore();

	useConnectedChain();

	useEffect(() => {
		if (status === "connected") {
			console.log("Config:", config.state);
			getWalletClient(config)
				.then((client) => {
					if (client.chain.id !== Constants.DEFAULT_NETWORK_ID) {
						console.log(
							`Switching to default network with id ${Constants.DEFAULT_NETWORK_ID}...`,
						);
						
						client.switchChain({
							id: Constants.DEFAULT_NETWORK_ID,
						});

						setTargetChainConnected(true);
					}
				})
				.catch((error) => {
					console.error("Error getting wallet client:", error);
				});
		} else {
			setTargetChainConnected(false);
		}
	}, [status, connectedChain]);

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

			{status === "connected" && isTargetChainConnected && (
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
