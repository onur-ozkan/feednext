import React, { Component } from 'react'
import { Select, Spin } from 'antd'

import { Dispatch } from 'redux'
import { connect } from 'dva'
import { GeographicItemType } from '../data.d'
import styles from './GeographicView.less'

const { Option } = Select

interface SelectItem {
	label: string
	key: string
}
const nullSelectItem: SelectItem = {
	label: '',
	key: '',
}

interface GeographicViewProps {
	dispatch?: Dispatch<any>
	province?: GeographicItemType[]
	city?: GeographicItemType[]
	value?: {
		province: SelectItem
		city: SelectItem
	}
	loading?: boolean
	onChange?: (value: { province: SelectItem; city: SelectItem }) => void
}

class GeographicView extends Component<GeographicViewProps> {
	componentDidMount = (): void => {
		const { dispatch } = this.props
		if (dispatch) {
			dispatch({
				type: 'accountAndSettings/fetchProvince',
			})
		}
	}

	componentDidUpdate(props: GeographicViewProps): void {
		const { dispatch, value } = this.props

		if (!props.value && !!value && !!value.province) {
			if (dispatch) {
				dispatch({
					type: 'accountAndSettings/fetchCity',
					payload: value.province.key,
				})
			}
		}
	}

	getProvinceOption(): JSX.Element | JSX.Element[] {
		const { province } = this.props
		if (province) {
			return this.getOption(province)
		}
		return []
	}

	getCityOption = (): JSX.Element | JSX.Element[] => {
		const { city } = this.props
		if (city) {
			return this.getOption(city)
		}
		return []
	}

	getOption = (list: GeographicItemType[]): JSX.Element | JSX.Element[] => {
		if (!list || list.length < 1) {
			return (
				<Option key={0} value={0}>
					没有找到选项
				</Option>
			)
		}
		return list.map(item => (
			<Option key={item.id} value={item.id}>
				{item.name}
			</Option>
		))
	}

	selectProvinceItem = (item: SelectItem): void => {
		const { dispatch, onChange } = this.props

		if (dispatch) {
			dispatch({
				type: 'accountAndSettings/fetchCity',
				payload: item.key,
			})
		}
		if (onChange) {
			onChange({
				province: item,
				city: nullSelectItem,
			})
		}
	}

	selectCityItem = (item: SelectItem): void => {
		const { value, onChange } = this.props
		if (value && onChange) {
			onChange({
				province: value.province,
				city: item,
			})
		}
	}

	conversionObject(): { province: SelectItem; city: SelectItem } {
		const { value } = this.props
		if (!value) {
			return {
				province: nullSelectItem,
				city: nullSelectItem,
			}
		}
		const { province, city } = value
		return {
			province: province || nullSelectItem,
			city: city || nullSelectItem,
		}
	}

	render(): JSX.Element {
		const { province, city } = this.conversionObject()
		const { loading } = this.props
		return (
			<Spin spinning={loading} wrapperClassName={styles.row}>
				<Select className={styles.item} value={province} labelInValue showSearch onSelect={this.selectProvinceItem}>
					{this.getProvinceOption()}
				</Select>
				<Select className={styles.item} value={city} labelInValue showSearch onSelect={this.selectCityItem}>
					{this.getCityOption()}
				</Select>
			</Spin>
		)
	}
}

export default connect(
	({
		accountAndSettings,
		loading,
	}: {
		accountAndSettings: {
			province: GeographicItemType[]
			city: GeographicItemType[]
		}
		loading: any
	}) => {
		const { province, city } = accountAndSettings
		return {
			province,
			city,
			loading: loading.models.accountAndSettings,
		}
	},
)(GeographicView)
