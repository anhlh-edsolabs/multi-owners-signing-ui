// import { useForm } from "@mantine/form";
import { createFormContext } from "@mantine/form";
import { FunctionCallFormData } from "../common/types";

// export function useFunctionCallForm() {
//   const form = useForm<FunctionCallFormData>({
//     initialValues: {
//         functionName: "",
//         params: [],
//         nonce: null,
//     },
//   });

//   return form;
// }

export const [
	FunctionCallFormProvider,
	useFunctionCallFormContext,
	useFunctionCallForm,
] = createFormContext<FunctionCallFormData>();