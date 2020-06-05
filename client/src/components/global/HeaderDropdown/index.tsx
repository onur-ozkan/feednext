// Antd dependencies
import { Dropdown } from 'antd'
import { DropDownProps } from 'antd/es/dropdown'

// Other dependencies
import React from 'react'
import classNames from 'classnames'

// Local files
import './index.less'

const HeaderDropdown: React.FC<DropDownProps> = ({ overlayClassName: cls, ...restProps }) => (
	<Dropdown overlayClassName={classNames('profile-dropdown', cls)} {...restProps} />
)

export default HeaderDropdown
