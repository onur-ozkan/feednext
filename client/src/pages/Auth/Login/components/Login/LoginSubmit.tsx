// Antd dependencies
import { Button } from 'antd'
import { Form } from '@ant-design/compatible'
import { ButtonProps } from 'antd/es/button'

// Other dependencies
import React from 'react'
import classNames from 'classnames'

// Local files
import styles from './index.less'
import '@ant-design/compatible/assets/index.css'

const FormItem = Form.Item

declare interface LoginSubmitProps extends ButtonProps {
	className?: string
}

const LoginSubmit: React.FC<LoginSubmitProps> = ({ className, ...rest }) => {
	const clsString = classNames(styles.submit, className)
	return (
		<FormItem>
			<Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
		</FormItem>
	)
}

export default LoginSubmit
