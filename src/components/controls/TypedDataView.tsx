import { ethers } from "ethers";
import { Stack, Title, Space } from "@mantine/core";
import { Prism } from "@mantine/prism";

import CombinedSignature from "./CombinedSignature";

import { useFunctionSelectionStore } from "../../hooks/stores/useFunctionSelectionStore";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";

const TypedDataView = () => {
	const { typedData } = useTypedDataStore();
	const { selectedFunction } = useFunctionSelectionStore();
	const { signature } = useSignatureStore();

	return (
		<>
			{selectedFunction && typedData && (
				<Stack spacing="lg">
					<Stack spacing="lg">
						<Space h="md" />
						<Title order={3}>Typed Data</Title>
						<Prism language="json" withLineNumbers>
							{JSON.stringify(typedData, null, 2)}
						</Prism>
						<Space h="md" />
						<Title order={3}>Function selector</Title>
						<Prism language="bash">
							{typedData.message.selector}
						</Prism>
						<Space h="md" />
						<Title order={3}>Input data</Title>
						<Prism language="json">
							{typedData.message.inputData}
						</Prism>
						<Space h="md" />
						<Title order={3}>Typed data struct hash</Title>
						<Prism language="json">
							{ethers.TypedDataEncoder.hashStruct(
								typedData.primaryType,
								typedData.types,
								typedData.message,
							)}
						</Prism>
						<Space h="md" />
						<Title order={3}>
							Digest hash (for on-chain verification)
						</Title>
						<Prism language="json">
							{ethers.TypedDataEncoder.hash(
								typedData.domain,
								typedData.types,
								typedData.message,
							)}
						</Prism>
					</Stack>
					{signature && (
						<Stack spacing="lg">
							<Space h="md" />
							<Title order={3}>Signature</Title>
							<Prism language="json">{signature}</Prism>
						</Stack>
					)}
					<CombinedSignature />
				</Stack>
			)}
		</>
	);
};

export default TypedDataView;
