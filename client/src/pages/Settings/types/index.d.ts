interface AccountUpdatePayload {
	fullName?: string
	email?: string
	link?: string
	biography?: string
	oldPassword?: string
	password?: string
}

interface AccountSettingsParams {
	user: {
		username: string
		full_name: string
		email: string
		biography: string
		link: string
		role: number
		is_verified: boolean
		is_active: boolean
		created_at: string
		updated_at: string
	},
	accessToken: string
}
