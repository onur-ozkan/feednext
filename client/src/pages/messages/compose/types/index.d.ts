export interface FormDataType {
	recipient: string
	body: string
}

export interface ComponentProps {
	history: {
		location: {
			state: {
				defaultUsername: string | undefined
			}
		}
	}
}
