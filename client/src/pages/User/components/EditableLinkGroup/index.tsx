import React, { createElement } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import styles from './index.less'
import Link from 'umi/link'

export declare interface EditableLink {
	title: string
	href: string
	id?: string
}

declare interface EditableLinkGroupProps {
	onAdd: () => void
	links: EditableLink[]
	linkElement: typeof Link
}

const EditableLinkGroup: React.FC<EditableLinkGroupProps> = props => {
	const { links, linkElement, onAdd } = props
	return (
		<div className={styles.linkGroup}>
			{links.map(link =>
				createElement(
					linkElement,
					{
						key: `linkGroup-item-${link.id || link.title}`,
						to: link.href,
						href: link.href,
					},
					link.title,
				),
			)}
			<Button size="small" type="primary" ghost onClick={onAdd}>
				<PlusOutlined /> Add to
			</Button>
		</div>
	)
}

EditableLinkGroup.defaultProps = {
	links: [],
	onAdd: (): void => {
		return
	},
	linkElement: 'a',
}

export default EditableLinkGroup
