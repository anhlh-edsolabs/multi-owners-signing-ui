import { Container, Stack, Group, Space, Flex, Grid } from "@mantine/core";
import CardWallet from "./components/CardWallet";
import CardERC20Token from "./components/CardERC20Token";
import CardSoftStakingContract from "./components/CardSoftStakingContract";

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
