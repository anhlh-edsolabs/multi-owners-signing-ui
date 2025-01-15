import { Button } from "@mantine/core";
import { FunctionCallFormData } from "../../common/types/form-data";
import { GenerateTypedDataButtonProps } from "../../common/types/props";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
// import { useConnectedChain } from "../../hooks/useConnectedChain";
import { useChainConnectionStore } from "../../hooks/stores/useChainConnectionStore";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";

import {
	createFunctionCallTypedData,
	SoftStakingDomain as domain,
} from "../../common/libs/soft-staking-EIP712";

const GenerateTypedDataButton = ({ label }: GenerateTypedDataButtonProps) => {
	const { connectedChain } = useChainConnectionStore();
	const { setExecutionData, setCombinedSignature } = useExecutionStore();
	const { setTypedData } = useTypedDataStore();
	const form = useFunctionCallFormContext();

	const handleTypedDataGeneration = (values: FunctionCallFormData) => {
		// clear Execution store
		setExecutionData("", "");
		setCombinedSignature("");

		domain.chainId = connectedChain?.id;

		try{const typedData = createFunctionCallTypedData(
			domain,
			values.functionName,
			values.nonce ?? 0,
			values.params,
		);

		console.log("TypedData", typedData);
		setTypedData(typedData);

		setExecutionData(
			typedData.message.selector,
			typedData.message.inputData,
		);} catch (error) {
			throw new Error(`Error generating typed data: ${error}`);
		}
	};

	return (
		<Button
			name="generate-typed-data"
			type="button"
			disabled={
				form.values.functionName == "" ||
				form.values.params.length == 0 ||
				isNaN(form.values.nonce as number)
			}
			onClick={() => handleTypedDataGeneration(form.values)}
		>
			{label}
		</Button>
	);
};

export default GenerateTypedDataButton;
