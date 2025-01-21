import { Radio, Group } from "@mantine/core";

const SelectFunctionTypeRadio = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	return (
		<Radio.Group
			name="function-type"
			color="blue"
			value={value}
			onChange={onChange}
		>
			<Group mt="xs">
				<Radio value="read" label="Read contract" />
				<Radio value="write" label="Write contract" />
			</Group>
		</Radio.Group>
	);
};

export default SelectFunctionTypeRadio;
