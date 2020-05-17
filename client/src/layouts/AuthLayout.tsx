// Antd dependencies
import { DefaultFooter } from '@ant-design/pro-layout'
import { GithubFilled } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { Link } from 'umi'

// Local files
import logo from '../assets/logo-square.svg'
import styles from './AuthLayout.less'

const AuthLayout: React.FC = props => {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.top}>
						<div className={styles.header}>
							<Link to="/">
								<img alt="logo" className={styles.logo} src={logo} />
								<span className={styles.title}>Feednext</span>
							</Link>
						</div>
						<div className={styles.desc} />
					</div>
					{props.children}
				</div>
				<DefaultFooter
					copyright="2019 Feednext"
					style={{
						backgroundColor: 'transparent',
					}}
					links={[
						{
							key: 'Github',
							title: <GithubFilled />,
							href: 'https://github.com/ilter-tech',
							blankTarget: true,
						},
					]}
				/>
			</div>
		</>
	)
}

export default AuthLayout
