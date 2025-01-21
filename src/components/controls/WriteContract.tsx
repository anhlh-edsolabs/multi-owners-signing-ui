/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { Button, Group, Stack, Text } from "@mantine/core";
import { IconTransitionRightFilled } from "@tabler/icons-react";
import {
	type BaseError,
	useWaitForTransactionReceipt,
	useWriteContract,
} from "wagmi";

import { simulateContract, SimulateContractErrorType } from "@wagmi/core";

import { wagmiConfig as config } from "../../common/config";

import { WriteContractProps } from "../../common/types/index";

import { useExecutionStore } from "../../hooks/stores/useExecutionStore";
import { useChainConnectionStore } from "../../hooks/stores/useChainConnectionStore";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";

const EXECUTE_FUNCTION = "execute";

const WriteContract = ({
	abi,
	address,
	funcName,
	args,
}: WriteContractProps) => {
	const { connectedChain } = useChainConnectionStore();

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

			const contractCallArgs = {
				abi,
				address,
				functionName: funcName,
				args,
			};

			// simulate contract call
			const simulation = await simulateContract(config, contractCallArgs);

			console.log("Simulation result:", simulation);

			// execute contract call
			console.log("Submitting transaction...");
			writeContract(contractCallArgs);
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
