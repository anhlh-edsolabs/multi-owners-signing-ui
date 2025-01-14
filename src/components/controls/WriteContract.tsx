/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { wagmiConfig as config } from "../../common/config";
import Constants from "../../common/constants";
import { WriteContractProps } from "../../common/types/index";
import { useConnectedChain } from "../../hooks/useConnectedChain";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";

import { Button, Group, Text, Stack } from "@mantine/core";
import { IconTransitionRightFilled } from "@tabler/icons-react";
import {
	type BaseError,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";

import { simulateContract, SimulateContractErrorType } from "@wagmi/core";

const EXECUTE_FUNCTION = "execute";

const WriteContract = ({ funcName, args }: WriteContractProps) => {
	const connectedChain = useConnectedChain();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { data: hash, error, isPending, writeContract } = useWriteContract();

	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash,
		});

	const { selectedFunction } = useFunctionSelectionStore();
	const { selector, calldata, combinedSignature } = useExecutionStore();
	const form = useFunctionCallFormContext();

	const handlePopulateExecutionData = () => {
		form.setFieldValue("params.0", selector);
		form.setFieldValue("params.1", calldata);
		form.setFieldValue("params.2", combinedSignature);
	};

	const handleWriteContract = async (funcName: string, args: any[]) => {
		try {
			setErrorMessage(null);

			console.log("Function Name:", funcName);
			console.log("Arguments:", args);

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
						disabled={
							selector === "" ||
							calldata === "" ||
							combinedSignature === ""
						}
						name="call-function"
						type="button"
						px="xl"
						onClick={handlePopulateExecutionData}
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
			{hash && (
				<Group grow align="center">
					<Stack align="center">
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
						{isConfirming && (
							<Text color="orange">
								Waiting for confirmation...
							</Text>
						)}
						{isConfirmed && (
							<Text color="green">Transaction confirmed.</Text>
						)}
					</Stack>
				</Group>
			)}
			{(error || errorMessage) && (
				<Group grow align="center">
					<Stack align="center">
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
					</Stack>
				</Group>
			)}
		</>
	);
};

export default WriteContract;
