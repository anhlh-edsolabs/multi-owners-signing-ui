import { Card, Stack } from "@mantine/core";

import Constants from "../../common/constants";
import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";

import {
	FunctionCallFormProvider,
	useFunctionCallForm,
} from "../../hooks/useFunctionCallForm";

import ContractInfo from "../controls/ContractInfo";
// import ReadContract from "../controls/ReadContract";
import ClaimDataFromAPI from "../controls/ClaimDataFromAPI";
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
	const { selectedFunction } = useFunctionSelectionStore();

	const form = useFunctionCallForm({
		initialValues: {
			functionName: "",
			params: [],
			nonce: null,
		},
	});

	console.log("Form initial values: ", form.values);

	return (
		// <ReadContract
		// 	funcName={"getNonce"}
		// 	args={[
		// 		getFunction(
		// 			form.values.functionName,
		// 			Constants.SOFTSTAKING_CONTRACT_ABI,
		// 		).selector,
		// 	]}
		// 	onListening={setNonce}
		// >
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
				{selectedFunction === SPECIAL_FUNCTION && <ClaimDataFromAPI />}
			</FunctionCallFormProvider>
		</Card>
		// </ReadContract>
	);
};

export default CardSoftStakingContract;
