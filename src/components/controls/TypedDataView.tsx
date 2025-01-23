import { ethers } from "ethers";
import { Stack } from "@mantine/core";
import CombinedSignature from "./CombinedSignature";
import DataViewItem from "./TypedDataViewItem";

import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";

const TypedDataView = () => {
	const { typedData } = useTypedDataStore();
	const { selectedFunction, selectedFunctionType } =
		useFunctionSelectionStore();
	const { signature } = useSignatureStore();

	return (
		<>
			{selectedFunction &&
				selectedFunctionType == "write" &&
				typedData && (
					<Stack spacing="lg">
						<Stack spacing="lg">
							<DataViewItem
								title="Typed Data"
								language="json"
								content={JSON.stringify(typedData, null, 2)}
							/>
							<DataViewItem
								title="Function selector"
								language="bash"
								content={typedData.message.selector}
							/>
							<DataViewItem
								title="Input data"
								language="json"
								content={typedData.message.inputData}
							/>
							<DataViewItem
								title="Typed data struct hash"
								language="json"
								content={ethers.TypedDataEncoder.hashStruct(
									typedData.primaryType,
									typedData.types,
									typedData.message,
								)}
							/>
							<DataViewItem
								title="Digest hash (for on-chain verification)"
								language="json"
								content={ethers.TypedDataEncoder.hash(
									typedData.domain,
									typedData.types,
									typedData.message,
								)}
							/>
						</Stack>
						{signature && (
							<DataViewItem
								title="Signature"
								language="json"
								content={signature}
							/>
						)}
						<CombinedSignature />
					</Stack>
				)}
		</>
	);
};

export default TypedDataView;
