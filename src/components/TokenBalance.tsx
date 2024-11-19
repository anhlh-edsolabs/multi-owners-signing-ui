import { Stack, Text } from "@mantine/core";
import { formatUnits } from "ethers";
import { erc20Abi } from "viem";
import { useBalance, useReadContracts, type BaseError } from "wagmi";

function useTokenBalance({
	address,
	token,
}: {
	address: `0x${string}`;
	token?: `0x${string}`;
}) {
	const nativeBalance = useBalance({
		address: address,
		query: {
			enabled: !token,
		},
	});

	const erc20Balance = useReadContracts({
		allowFailure: false,
		contracts: [
			{
				address: token,
				abi: erc20Abi,
				functionName: "balanceOf",
				args: [address],
			},
			{
				address: token,
				abi: erc20Abi,
				functionName: "decimals",
			},
			{
				address: token,
				abi: erc20Abi,
				functionName: "symbol",
			},
		],
		query: {
			enabled: !!token,
		},
	});

	if (token) {
		if (erc20Balance.isError) {
			return {
				balance: BigInt(0),
				decimals: 0,
				symbol: "",
				isPending: erc20Balance.isPending,
				error: erc20Balance.error,
			};
		}

		return {
			balance: erc20Balance.data?.[0] as bigint,
			decimals: erc20Balance.data?.[1] as number,
			symbol: erc20Balance.data?.[2] as string,
			isPending: erc20Balance.isPending,
			error: erc20Balance.error,
		};
	} else {
		if (nativeBalance.isError) {
			return {
				balance: BigInt(0),
				decimals: 0,
				symbol: "",
				isPending: nativeBalance.isPending,
				error: nativeBalance.error,
			};
		}
		return {
			balance: nativeBalance.data?.value,
			decimals: nativeBalance.data?.decimals,
			symbol: nativeBalance.data?.symbol,
			isPending: nativeBalance.isPending,
			error: nativeBalance.error,
		};
	}
}

function TokenBalance({
	address,
	token,
}: {
	address: `0x${string}`;
	token?: `0x${string}`;
}) {
	const { balance, decimals, symbol, isPending, error } = useTokenBalance({
		address,
		token,
	});

	if (isPending) {
		return <Text>Loading...</Text>;
	}
	if (error) {
		return (
			<Text>
				Error: {(error as BaseError).shortMessage || error.message}
			</Text>
		);
	}

	const formatted =
		balance && decimals ? formatUnits(balance, decimals) : undefined;
	console.log("Balance:", { balance, formatted });
	return (
		<Stack>
			<Text>
				Balance:{" "}
				<Text span size="sm" fw="bold" color="gray.8">
					{formatted} {symbol}
				</Text>
			</Text>
		</Stack>
	);
}

export default TokenBalance;
