import Constants from "../common/constants";
import { WriteContractProps } from "../common/types";
import { useConnectedChain } from "../hooks/useConnectedChain.ts";

import { Button, Group, Stack, Text } from "@mantine/core";
import { IconTransitionRightFilled } from "@tabler/icons-react";
import {
	type BaseError,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";

const WriteContract = ({ funcName, args }: WriteContractProps) => {
	const connectedChain = useConnectedChain();
	const { data: hash, error, isPending, writeContract } = useWriteContract();

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	return (
		<>
			<Group grow align="center">
				<Stack align="center">
					<Button
						name="call-function"
						type="button"
						px="xl"
						onClick={() =>
							writeContract({
								abi: Constants.SOFTSTAKING_CONTRACT_ABI,
								address: Constants.SOFTSTAKING_ADDRESS,
								functionName: funcName,
								args: args,
							})
						}
					>
						{isPending ? "Confirming..." : "Call selected function"}
					</Button>
					{hash && (
						<Text>
							Transaction hash:{" "}
							<Text span size="sm" fw="bold" color="gray.8">
								<Button
									disabled={isPending}
									rightIcon={
										<IconTransitionRightFilled size="1rem" />
									}
									onClick={() =>
										window.open(
											`${connectedChain?.blockExplorers?.default.url}/tx/${hash}`,
										)
									}
									variant="white"
									color="blue"
								>
									{hash}
								</Button>
							</Text>
						</Text>
					)}
					{isConfirming && <Text>Waiting for confirmation...</Text>}
					{isConfirmed && <Text>Transaction confirmed.</Text>}
					{error && (
						<Text variant="text" color="red">
							{(error as BaseError).metaMessages?.[0] +
								" " +
								(error as BaseError).metaMessages?.[1] +
								" " || error.message}
						</Text>
					)}
				</Stack>
			</Group>
		</>
	);
};

export default WriteContract;
