import { useEffect } from "react";
import { Button } from "@mantine/core";

import { useSignTypedData } from "wagmi";
import { useTypedDataStore } from "../../hooks/stores/useTypedDataStore";
import { useSignatureStore } from "../../hooks/stores/useSignatureStore";

import { SignTypedDataButtonProps } from "../../common/types/props";

const SignTypedDataButton = ({ label }: SignTypedDataButtonProps) => {
	const { signTypedDataAsync, data: signatureData } = useSignTypedData();
	const { setSignature } = useSignatureStore();
	const { typedData } = useTypedDataStore();

	useEffect(() => {
		if (signatureData) {
			console.log("Signature: ", signatureData);
			setSignature(signatureData);
		}
	}, [setSignature, signatureData]);

	return (
		<Button
			name="sign-typed-data"
			onClick={() => {
				if (typedData) {
					signTypedDataAsync(typedData);
				}
			}}
		>
			{label}
		</Button>
	);
};

export default SignTypedDataButton;
