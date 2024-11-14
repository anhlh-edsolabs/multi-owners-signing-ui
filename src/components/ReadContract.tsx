import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { ReadContractProps } from "../common/types";
import Constants from "../common/Constants";

const ReadContract = ({
	funcName,
	children,
	args,
	onListening,
}: ReadContractProps) => {
	const { data, isSuccess } = useReadContract({
		abi: Constants.SOFTSTAKING_CONTRACT_ABI,
		address: Constants.SOFTSTAKING_ADDRESS,
		functionName: funcName,
		args: args,
	});
	console.log("Nonce after reading from contract:", data);

	useEffect(() => {
		if (isSuccess) {
			onListening?.(data);
		}
	}, [isSuccess, data, onListening]);
	return <>{children}</>;
};

export default ReadContract;
