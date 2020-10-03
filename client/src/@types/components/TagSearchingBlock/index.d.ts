export interface TagSearchingBlockProps {
	tagFilter: string[]
	setTagFilter: (tag: string) => void
	beforeTagDeSelect: () => void
	updateTagFilterList: React.Dispatch<React.SetStateAction<string>>
}