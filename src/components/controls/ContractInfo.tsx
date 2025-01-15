import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconTransitionRightFilled } from "@tabler/icons-react";

import { ContractInfoProps } from "../../common/types/index";

// import { useConnectedChain } from "../../hooks/useConnectedChain";
import { useChainConnectionStore } from "../../hooks/stores/useChainConnectionStore";

const ContractInfo = ({ title, address }: ContractInfoProps) => {
	const {connectedChain} = useChainConnectionStore();
	return (
		<Group grow>
			<Stack>
				<Title transform="uppercase" order={3}>
					{title}
				</Title>
				<Text>
					Contract Address:{" "}
					<Text span size="sm" fw="bold" color="gray.8">
						<Button
							rightIcon={
								<IconTransitionRightFilled size="1rem" />
							}
							onClick={() =>
								window.open(
									`${connectedChain?.blockExplorers?.default.url}/address/${address}`,
								)
							}
							variant="white"
							color="blue"
						>
							{address}
						</Button>
					</Text>
				</Text>
			</Stack>
		</Group>
	);
};

export default ContractInfo;
