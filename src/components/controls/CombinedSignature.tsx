import { Stack } from "@mantine/core";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";

import DataViewItem from "./TypedDataViewItem";

const CombinedSignature = () => {
	const { combinedSignature } = useExecutionStore();

	return (
		combinedSignature && (
			<Stack spacing="lg">
				<DataViewItem
					title="Combined Signature"
					language="bash"
					content={combinedSignature || "0x"}
				/>
			</Stack>
		)
	);
};

export default CombinedSignature;
