// Antd dependencies
import { Modal } from "antd"

// Other dependencies
import React from "react"

// Local files
import { PrivacyPolicy } from "./components/PrivacyPolicy"
import { TermsAndConditions } from "./components/TermsAndConditions"
import { ComponentProps } from "./types"

export const Aggrements: React.FC<ComponentProps> = (props): JSX.Element => (
	<>
		{props.aggrementModalVisibility && ( // To handle buggy animation on window close
			<Modal
				transitionName='fade'
				visible={!!props.aggrementModalVisibility}
				closable={false}
				footer={null}
				onCancel={props.closeAggrementWindow}
			>
				{props.aggrementModalVisibility === 'policy' ? <PrivacyPolicy /> : <TermsAndConditions />}
			</Modal>
		)}
	</>
)
