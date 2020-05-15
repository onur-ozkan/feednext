export interface CategoryData {
	id: string
	name: string
	is_leaf: boolean
	ancestors: string[]
	created_at: string
	updated_at: string
}

export interface ComponentProps {
	placeHolder?: string
	defaultValue?: string
	onSelect?: (id: string, title: React.ReactNode[]) => any
}
