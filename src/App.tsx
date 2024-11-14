import { Container, Grid, Space, Stack } from "@mantine/core";
import CardERC20Token from "./components/CardERC20Token";
import CardSoftStakingContract from "./components/CardSoftStakingContract";
import CardWallet from "./components/CardWallet";

export default function App() {
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

			<Space h="md" />
			<Stack>
				<CardSoftStakingContract />
			</Stack>
		</Container>
	);
}
