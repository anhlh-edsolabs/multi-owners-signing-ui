import { Loader, Space, Stack } from "@mantine/core";

const CustomLoader = () => {
	return (
		<Stack py="xs">
			<Space h="md" />
			<Loader size="xs" />
		</Stack>
	);
};

export default CustomLoader;
