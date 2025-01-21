import { Title, Space } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { Language } from "prism-react-renderer";

const TypedDataViewItem = ({
	title,
	language,
	content,
	withLineNumbers = true,
}: {
	title: string;
	language: Language;
	content: string;
	withLineNumbers?: boolean;
}) => {
	// withLineNumbers = withLineNumbers || true;
	return (
		<>
			<Space h="md" />
			<Title order={3}>{title}</Title>
			<Prism language={language} withLineNumbers={withLineNumbers}>
				{content}
			</Prism>
		</>
	);
};

export default TypedDataViewItem;
