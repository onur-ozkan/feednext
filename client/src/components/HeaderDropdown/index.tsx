// Antd dependencies
import { Dropdown } from 'antd'
import { DropDownProps } from 'antd/es/dropdown'

// Other dependencies
import React from 'react'
import classNames from 'classnames'

// Local files
import styles from './index.less'

declare type OverlayFunc = () => React.ReactNode

export declare interface HeaderDropdownProps extends DropDownProps {
	overlayClassName?: string
	overlay: React.ReactNode | OverlayFunc
	placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter'
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
	<Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />
)

export default HeaderDropdown
