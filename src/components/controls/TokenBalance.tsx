import { Stack, Text } from "@mantine/core";
import { type BaseError } from "wagmi";

import { formatUnits } from "ethers";

import { useTokenBalance } from "../../hooks/useTokenBalance";

import ErrorAlert from "./ErrorAlert";
import CustomLoader from "./CustomLoader";

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
		return <CustomLoader />;
	}
	if (error) {
		return (
			<ErrorAlert
				message={(error as BaseError).shortMessage || error.message}
			/>
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
