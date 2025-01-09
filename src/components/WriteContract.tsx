/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { wagmiConfig as config } from "../common/config";
import Constants from "../common/constants";
import { WriteContractProps } from "../common/types";
import { useConnectedChain } from "../hooks/useConnectedChain.ts";
import { useFunctionSelectionStore } from "../hooks/useFunctionSelectionStore.ts";

import { Button, Group, Text, Stack } from "@mantine/core";
import { IconTransitionRightFilled } from "@tabler/icons-react";
import {
	type BaseError,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";

import {
	// estimateGas,
	getGasPrice,
	simulateContract,
	SimulateContractErrorType,
} from "@wagmi/core";

// import { useAppKitAccount } from "@reown/appkit/react";

import { ethers } from "ethers";

const EXECUTE_FUNCTION = "execute";

const WriteContract = ({
	funcName,
	args,
	customHandler,
}: WriteContractProps) => {
	const connectedChain = useConnectedChain();
	// const { address } = useAppKitAccount();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { data: hash, error, isPending, writeContract } = useWriteContract();

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	const { selectedFunction } = useFunctionSelectionStore();

	// const estimateGasFunctionCall = async (funcName: string, args: any[]) => {

	// 	const contract = new ethers.Contract(
	// 		Constants.SOFTSTAKING_ADDRESS,
	// 		Constants.SOFTSTAKING_CONTRACT_ABI,
	// 	);

	// 	console.log("Estimating gas...");
	// 	const txData = contract.interface.encodeFunctionData(funcName, args);
	// 	const estimatedGas = await estimateGas(config, {
	// 		to: Constants.SOFTSTAKING_ADDRESS,
	// 		data: txData as `0x${string}`,
	// 		account: address as `0x${string}`,
	// 		value: BigInt(0),
	// 		type: "eip1559",
	// 	});

	// 	console.log("Estimated gas:", estimatedGas);
	// };

	const handleWriteContract = async (funcName: string, args: any[]) => {
		try {
			setErrorMessage(null);
			console.log("Function Name:", funcName);
			console.log("Arguments:", args);

			console.log("Acquiring gas price...");
			const gasPrice = await getGasPrice(config);
			console.log("Gas price:", ethers.formatUnits(gasPrice, "gwei"));

			// simulate contract call
			const simulation = await simulateContract(config, {
				abi: Constants.SOFTSTAKING_CONTRACT_ABI,
				address: Constants.SOFTSTAKING_ADDRESS,
				functionName: funcName,
				args,
			});

			console.log("Simulation result:", simulation);

			// execute contract call
			console.log("Submitting transaction...");
			writeContract({
				abi: Constants.SOFTSTAKING_CONTRACT_ABI,
				address: Constants.SOFTSTAKING_ADDRESS,
				functionName: funcName,
				args: args,
			});
		} catch (err: any) {
			console.log("Error:", err);
			setErrorMessage((err as SimulateContractErrorType).message);
		}
	};

	return (
		<>
			<Group grow align="center">
				{selectedFunction == EXECUTE_FUNCTION && (
					<Button
						name="call-function"
						type="button"
						px="xl"
						onClick={customHandler}
					>
						Populate execution data
					</Button>
				)}
				<Button
					name="call-function"
					type="button"
					px="xl"
					onClick={() => handleWriteContract(funcName, args || [])}
				>
					{isPending ? "Confirming..." : "Call selected function"}
				</Button>
			</Group>
			<Group grow align="center">
				<Stack align="center">
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
					{isConfirming && <Text color="orange">Waiting for confirmation...</Text>}
					{isConfirmed && <Text color="green">Transaction confirmed.</Text>}
				</Stack>
				{error && (
					<Text
						variant="text"
						color="red"
						style={{ lineBreak: "anywhere" }}
					>
						{(error as BaseError).metaMessages?.[0] +
							" " +
							(error as BaseError).metaMessages?.[1] +
							" " || error.message}
					</Text>
				)}
				{errorMessage && (
					<Text
						variant="text"
						color="red"
						style={{ lineBreak: "anywhere" }}
					>
						{errorMessage}
					</Text>
				)}
			</Group>
		</>
	);
};

export default WriteContract;
