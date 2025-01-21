/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import {
	Config,
	createConfig,
	http,
	readContract,
	type ReadContractErrorType,
} from "@wagmi/core";
import { Chain } from "@wagmi/core/chains";
import { type BaseError } from "wagmi";

import { Alert, Button, Group, Loader, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import { toObject } from "../../common/libs/utils";
import { ReadContractProps } from "../../common/types";

import TypedDataViewItem from "./TypedDataViewItem";

import { useChainConnectionStore } from "../../hooks/stores/useChainConnectionStore";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";

const ReadContract = ({ abi, address, funcName, args }: ReadContractProps) => {
	const { connectedChain } = useChainConnectionStore();
	const { selectedFunctionABI } = useFunctionSelectionStore();
	const [chainConfig, setChainConfig] = useState<Config | null>(null);
	const [parseData, setParsedData] = useState<string>("");
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<ReadContractErrorType | null>(null);

	useEffect(() => {
		const networks = connectedChain ? [connectedChain] : [];
		if (!chainConfig) {
			const newConfig = createConfig({
				chains: networks as unknown as readonly [Chain, ...Chain[]],
				transports: {
					[networks[0].id]: http(),
				},
			});
			setChainConfig(newConfig);
		}
	}, [chainConfig, connectedChain]);

	// const config = chainConfig;

	const paramsRequired =
		selectedFunctionABI?.inputs && selectedFunctionABI?.inputs.length > 0;

	const fetchData = useCallback(
		async (funcName: string, args: any[]) => {
			if (!chainConfig) return;

			setLoading(true);
			setError(null);

			try {
				const result = await readContract(chainConfig, {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[chainConfig],
	);

	useEffect(() => {
		if (!paramsRequired) {
			fetchData(funcName, args || []);
		} else {
			setParsedData("");
		}
	}, [paramsRequired, funcName, args, fetchData]);

	// const { data, isSuccess, error, isPending } = useReadContract({
	// 	abi,
	// 	address,
	// 	functionName: funcName,
	// 	args: args,
	// });

	// setParsedData("");

	// useEffect(() => {
	// 	if (isSuccess) {
	// 		const parsedData = toObject(data);
	// 		setParsedData(JSON.stringify(parsedData, null, 2));
	// 	}
	// }, [isSuccess, data]);

	// const handleReadContract = useCallback(
	// 	async (funcName: string, args: any[]) => {
	// 		setLoading(true);
	// 		try {
	// 			const data = await readContract(config as Config, {
	// 				abi,
	// 				address,
	// 				functionName: funcName,
	// 				args,
	// 			});
	// 			console.log("Data", data);

	// 			const parseData = toObject(data);
	// 			setParsedData(JSON.stringify(parseData, null, 2));
	// 		} catch (err: unknown) {
	// 			const error = err as ReadContractErrorType;
	// 			console.error(error);
	// 			setError(error);
	// 		}
	// 		setLoading(false);
	// 	},
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// 	[funcName, args],
	// );

	// useEffect(() => {
	// 	if (paramsRequired) {
	// 		console.log("Params required", paramsRequired);
	// 		handleReadContract(funcName, args || []);
	// 	}
	// }, [paramsRequired, funcName, args, handleReadContract]);

	if (paramsRequired) {
		// setParsedData("");
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
