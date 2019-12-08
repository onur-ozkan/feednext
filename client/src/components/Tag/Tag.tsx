import React from 'react'
import { Tag } from 'antd'

declare interface IComponentProps {
    color: string,
    name: string
}

export const TagComponent: React.FunctionComponent<IComponentProps> = props => (
    <Tag color={props.color}>{props.name}</Tag>
)
