module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	extends: [
		'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
	],
	parserOptions: {
		ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	settings: {
		react: {
			version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
	rules: {
		semi: 0,
		'react/prop-types': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'react/display-name': 0,
		'@typescript-eslint/member-delimiter-style': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
	},
	globals: {
		ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
		page: true,
		REACT_APP_ENV: true,
	},
}
