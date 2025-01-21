import { Card, Stack } from "@mantine/core";

import Constants from "../../common/constants";

import {
	FunctionCallFormProvider,
	useFunctionCallForm,
} from "../../hooks/useFunctionCallForm";

import ContractInfo from "../controls/ContractInfo";
import SoftStakingFunctionSelection from "../controls/SoftStakingFunctionSelection";
import SoftStakingFunctionInput from "../controls/SoftStakingFunctionInput";
import TypedDataView from "../controls/TypedDataView";

const CONTRACT_TITLE = "Soft Staking Multi-Owners contract";
const SPECIAL_FUNCTION = "createClaimDataMultiple";
const MULTI_SIG_FUNCTIONS = [
	"createClaimDataMultiple",
	"createClaimData",
	"changeOwner",
	"setSignerThreshold",
	"setRewardThreshold",
];

const CardSoftStakingContract = () => {
	const form = useFunctionCallForm({
		initialValues: {
			functionName: "",
			params: [],
			nonce: null,
		},
	});

	console.log("Form values: ", form.values);

	return (
		<Card
			shadow="sm"
			padding="lg"
			radius="md"
			withBorder
			style={{ overflow: "visible" }}
		>
			<FunctionCallFormProvider form={form}>
				<Stack spacing="lg">
					<ContractInfo
						title={CONTRACT_TITLE}
						address={Constants.SOFTSTAKING_ADDRESS}
					/>
					<SoftStakingFunctionSelection
						abi={Constants.SOFTSTAKING_CONTRACT_ABI}
						address={Constants.SOFTSTAKING_ADDRESS}
						functionWithNonces={[
							...MULTI_SIG_FUNCTIONS,
							SPECIAL_FUNCTION,
						]}
					/>
				</Stack>
				<SoftStakingFunctionInput
					multiSigs={MULTI_SIG_FUNCTIONS}
					special={SPECIAL_FUNCTION}
				/>
				<TypedDataView />
			</FunctionCallFormProvider>
		</Card>
	);
};

export default CardSoftStakingContract;
