import { Container, Grid, Space, Stack } from "@mantine/core";
import CardERC20Token from "./components/cards/CardERC20Token";
import CardSoftStakingContract from "./components/cards/CardSoftStakingContract";
import CardWallet from "./components/cards/CardWallet";
import CardCombineSignatures from "./components/cards/CardCombineSignatures";

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
			<Space h="md" />
			<Stack>
				<CardCombineSignatures />
			</Stack>
		</Container>
	);
}
