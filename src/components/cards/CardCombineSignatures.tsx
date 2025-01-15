import {
	Button,
	Card,
	Grid,
	Space,
	Stack,
	TextInput
} from "@mantine/core";

import { useForm } from "@mantine/form";

import { SignaturesFormData } from "../../common/types/index";
import { useExecutionStore } from "../../hooks/stores/useExecutionStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";

import CombinedSignature from "../controls/CombinedSignature";

import { ethers } from "ethers";

const CardCombineSignatures = () => {
	const form = useForm<SignaturesFormData>({
		initialValues: {
			signature1: "",
			signature2: "",
			signature3: "",
		},
	});

	const { signature } = useSignatureStore();
	const { setCombinedSignature } = useExecutionStore();

	const touchAcquire = (index: number) => {
		return form.setFieldValue(`signature${index}`, signature);
	};

	const combineSignatures = () => {
		const signatures = [
			form.values.signature1,
			form.values.signature2 || "0x",
			form.values.signature3 || "0x",
		];

		const combinedSignature = ethers.concat(signatures);
		console.log(combinedSignature);

		setCombinedSignature(combinedSignature);
	};

	return (
		<Card
			shadow="sm"
			padding="lg"
			radius="md"
			withBorder
			style={{ overflow: "visible" }}
		>
			<Stack spacing="lg">
				{[1, 2, 3].map((index) => (
					<Grid
						key={index}
						grow
						justify="space-between"
						align="flex-end"
					>
						<Grid.Col span={10}>
							<TextInput readOnly
								value={
									form.getInputProps(`signature${index}`)
										.value
								}
								label={`Signature ${index}`}
								placeholder="0x"
							/>
						</Grid.Col>
						<Grid.Col span={2}>
							<Button onClick={() => touchAcquire(index)}>
								Acquire signature
							</Button>
						</Grid.Col>
					</Grid>
				))}
			</Stack>
			<Stack spacing="lg" align="center">
				<Space h="md" />
				<Button onClick={combineSignatures}>
					Combine signatures
				</Button>
			</Stack>
			<CombinedSignature />
		</Card>
	);
};

export default CardCombineSignatures;
