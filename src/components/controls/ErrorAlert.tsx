import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

const ErrorAlert = ({ message }: { message: string }) => {
	return (
		<Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
			{message}
		</Alert>
	);
};

export default ErrorAlert;
