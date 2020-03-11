declare interface Constants {
	DEV: boolean
	API_URL: string
}

const constants: Constants = {
	DEV: process.env.NODE_ENV !== 'production',
	API_URL: 'http://localhost/api',
}

export const getConstant = (key: string): any => {
	if (!constants[key]) throw new Error(`Missing ${key} variable in _constants file.`)
	return constants[key]
}
