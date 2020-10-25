// Antd dependencies
import { Modal } from 'antd'

// Other dependencies
import React from 'react'

// Local files
import { PrivacyPolicy } from './PrivacyPolicy'
import { TermsAndConditions } from './TermsAndConditions'
import { AggrementsProps } from '@/@types/components'

export const Aggrements: React.FC<AggrementsProps> = (props): JSX.Element => (
	<div style={{ position: 'absolute' }}>
		{props.aggrementModalVisibility && ( // To handle buggy animation on window close
			<Modal
				transitionName='fade'
				style={{ top: 35 }}
				visible={!!props.aggrementModalVisibility}
				closable={false}
				footer={null}
				onCancel={props.closeAggrementWindow}
			>
				{props.aggrementModalVisibility === 'policy' ? <PrivacyPolicy /> : <TermsAndConditions />}
			</Modal>
		)}
	</div>
)
