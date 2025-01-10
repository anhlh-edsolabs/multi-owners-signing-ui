import { Stack, Text } from "@mantine/core";
import { formatUnits } from "ethers";
import { type BaseError } from "wagmi";
import { useTokenBalance } from "../../hooks/useTokenBalance";

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

	const formatted = formatUnits(balance, decimals);
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
