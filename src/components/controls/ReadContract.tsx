/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import { readContract, type ReadContractErrorType } from "@wagmi/core";
import { type BaseError } from "wagmi";

import { Button, Group, Stack } from "@mantine/core";

import { wagmiConfig } from "../../common/config";
import { toObject } from "../../common/libs/utils";
import { ReadContractProps } from "../../common/types";

import ErrorAlert from "./ErrorAlert";
import CustomLoader from "./CustomLoader";
import DataViewItem from "./TypedDataViewItem";

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
				{isLoading && <CustomLoader />}
				{parseData && (
					<Stack spacing="xs">
						<DataViewItem
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
			return <CustomLoader />;
		}
		if (error) {
			return (
				<ErrorAlert
					message={
						(error as unknown as BaseError).shortMessage ||
						error.message
					}
				/>
			);
		}
		return (
			<Group grow align="center">
				{isLoading && <CustomLoader />}
				{parseData && (
					<Stack spacing="xs">
						<DataViewItem
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
