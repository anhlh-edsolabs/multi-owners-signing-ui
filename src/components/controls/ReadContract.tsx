/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import { readContract, type ReadContractErrorType } from "@wagmi/core";
// import { Chain } from "@wagmi/core/chains";
import { type BaseError } from "wagmi";

import { Alert, Button, Group, Loader, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { wagmiConfig } from "../../common/config";
import { toObject } from "../../common/libs/utils";
import { ReadContractProps } from "../../common/types";

import TypedDataViewItem from "./TypedDataViewItem";

// import { useChainConnectionStore } from "../../hooks/stores/useChainConnectionStore";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";

const ReadContract = ({ abi, address, funcName, args }: ReadContractProps) => {
	const { selectedFunctionABI } = useFunctionSelectionStore();
	const [parseData, setParsedData] = useState<string>("");
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<ReadContractErrorType | null>(null);

	const paramsRequired =
		selectedFunctionABI?.inputs && selectedFunctionABI?.inputs.length > 0;

	const fetchData = useCallback(
		async (funcName: string, args: any[]) => {
			if (!wagmiConfig) return;

			setLoading(true);
			setError(null);

			try {
				const result = await readContract(wagmiConfig, {
					abi,
					address,
					functionName: funcName,
					args,
				});

				const parsedData = toObject(result);
				setParsedData(JSON.stringify(parsedData, null, 2));
			} catch (err) {
				setError(err as ReadContractErrorType);
			} finally {
				setLoading(false);
			}
		},
		[abi, address],
	);

	useEffect(() => {
		if (!paramsRequired) {
			fetchData(funcName, args || []);
		} else {
			setParsedData("");
		}
	}, [paramsRequired, funcName, args, fetchData]);

	if (paramsRequired) {
		return (
			<Stack>
				<Group>
					<Button
						name="call-function"
						type="button"
						px="xl"
						disabled={isLoading}
						onClick={() => fetchData(funcName, args || [])}
					>
						Query function data
					</Button>
				</Group>
				{isLoading && (
					<Stack py="xs">
						<Loader size="xs" />
					</Stack>
				)}
				{parseData && (
					<Stack spacing="xs">
						<TypedDataViewItem
							title="Result"
							language="json"
							withLineNumbers={false}
							content={parseData}
						/>
					</Stack>
				)}
			</Stack>
		);
	} else {
		if (isLoading) {
			return (
				<Stack py="xs">
					<Loader size="xs" />
				</Stack>
			);
		}
		if (error) {
			return (
				<Alert
					icon={<IconAlertCircle size="1rem" />}
					title="Error"
					color="red"
				>
					{(error as unknown as BaseError).shortMessage ||
						error.message}
				</Alert>
			);
		}
		return (
			<Group grow align="center">
				{isLoading && (
					<Stack py="xs">
						<Loader size="xs" />
					</Stack>
				)}
				{parseData && (
					<Stack spacing="xs">
						<TypedDataViewItem
							title="Result"
							language="json"
							withLineNumbers={false}
							content={parseData}
						/>
					</Stack>
				)}
			</Group>
		);
	}
};

export default ReadContract;
