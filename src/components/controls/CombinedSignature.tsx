import { Stack } from "@mantine/core";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";

import TypedDataViewItem from "./TypedDataViewItem";

const CombinedSignature = () => {
	const { combinedSignature } = useExecutionStore();

	return (
		combinedSignature && (
			<Stack spacing="lg">
				<TypedDataViewItem
					title="Combined Signature"
					language="bash"
					content={combinedSignature || "0x"}
				/>
			</Stack>
		)
	);
};

export default CombinedSignature;
