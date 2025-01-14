import { Button } from "@mantine/core";
import { FunctionCallFormData } from "../../common/types/form-data";
import { GenerateTypedDataButtonProps } from "../../common/types/props";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
import { useConnectedChain } from "../../hooks/useConnectedChain";
import { useFunctionCallFormContext } from "../../hooks/useFunctionCallForm";

import {
    createFunctionCallTypedData,
    SoftStakingDomain as domain
} from "../../common/libs/soft-staking-EIP712";

const GenerateTypedDataButton = ({
    label
}: GenerateTypedDataButtonProps) => {
    const connectedChain  = useConnectedChain();
	const { setExecutionData, setCombinedSignature } = useExecutionStore();
	const { setTypedData } = useTypedDataStore();
	const form = useFunctionCallFormContext();

	const handleTypedDataGeneration = (values: FunctionCallFormData) => {
		// clear Execution store
		setExecutionData("", "");
		setCombinedSignature("");

		domain.chainId = connectedChain?.id;

		const typedData = createFunctionCallTypedData(
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
		);
	};

	return (
		<Button
			name="generate-typed-data"
			type="button"
			onClick={() => handleTypedDataGeneration(form.values)}
		>
			{label}
		</Button>
	);
};

export default GenerateTypedDataButton;