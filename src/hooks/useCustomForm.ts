import { useForm } from "@mantine/form";
import { FunctionCallFormData } from "../common/types";

export function useFunctionCallForm() {
  const form = useForm<FunctionCallFormData>({
    initialValues: {
        functionName: "",
        params: [],
        nonce: null,
    },
  });

  return form;
}