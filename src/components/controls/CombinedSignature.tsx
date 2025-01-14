import { Space, Stack, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";

const CombinedSignature = () => {
	const { combinedSignature } = useExecutionStore();

	return (
		combinedSignature && (
			<Stack spacing="lg">
				<Space h="md" />
				<Title order={3}>Combined Signature</Title>
				<Prism language="bash">{combinedSignature || "0x"}</Prism>
			</Stack>
		)
	);
};

export default CombinedSignature;
