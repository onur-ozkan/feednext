import { Tag, Button } from 'antd'
import React from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import { ConnectProps, ConnectState } from '@/models/connect'
import { PlusCircleOutlined } from '@ant-design/icons'

import Avatar from './AvatarDropdown'
import HeaderSearch from '../HeaderSearch'
import SelectLang from '../SelectLang'
import styles from './index.less'
import NoticeIconView from './NoticeIconView'
import { router } from 'umi'

export type SiderTheme = 'light' | 'dark'
export interface GlobalHeaderRightProps extends ConnectProps {
	theme?: SiderTheme
	layout: 'sidemenu' | 'topmenu'
}

const ENVTagColor = {
	dev: 'orange',
	test: 'green',
	pre: '#87d068',
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
	const { theme, layout } = props
	let className = styles.right

	if (theme === 'dark' && layout === 'topmenu') {
		className = `${styles.right}  ${styles.dark}`
	}

	const routeTo = (path: string): void => {
		router.push(path)
	}

	return (
		<div className={className}>
			<Button
				onClick={(): void => routeTo('/feeds/create-feed')}
				type="dashed"
				shape="round"
				icon={<PlusCircleOutlined />}
			>
				{' '}
				New Feed{' '}
			</Button>
			<HeaderSearch
				className={`${styles.action} ${styles.search}`}
				placeholder={formatMessage({
					id: 'component.globalHeader.search',
				})}
				// defaultValue="umi ui"
				dataSource={[
					formatMessage({
						id: 'component.globalHeader.search.example1',
					}),
					formatMessage({
						id: 'component.globalHeader.search.example2',
					}),
					formatMessage({
						id: 'component.globalHeader.search.example3',
					}),
				]}
				onSearch={(): void => {
					return
				}}
				onPressEnter={(): void => {
					return
				}}
			/>
			<NoticeIconView />
			<Avatar />
			<SelectLang className={styles.action} />
			{REACT_APP_ENV && <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>}
		</div>
	)
}

export default connect(({ settings }: ConnectState) => ({
	theme: settings.navTheme,
	layout: settings.layout,
}))(GlobalHeaderRight)
