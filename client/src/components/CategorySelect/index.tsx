// Antd dependencies
import { TreeSelect } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'

// Local files
import { fetchMainCategories, fetchChildCategories } from '@/services/api'
import { CategoryData, ComponentProps } from './types'
import './style.less'

export const CategorySelect = (props: ComponentProps): JSX.Element => {
	const [categories, setCategories] = useState<any[]>([])

	useEffect(() => {
		fetchMainCategories().then(async ({ data }) => {
			const refactoredArray = await data.attributes.categories.map((category: CategoryData) => {
				return {
					id: category.id,
					pId: 0,
					disabled: !category.is_leaf,
					title: category.name.toUpperCase(),
					value: category.name,
					isLeaf: category.is_leaf
				}
			})
			setCategories(refactoredArray)
		})
	}, [])

	const handleOnCategoryChangeEvent = (id: string, title: React.ReactNode[]): void => {
		props.onSelect(id, title)
	}

	const handleOnCategoryLoad = (treeNode: any): any => {
		return new Promise(async resolve => {
			await fetchChildCategories(treeNode.id).then(async ({ data }) => {
				data.attributes.categories.map((item: CategoryData) => {
					setCategories((currentState) => [...currentState, {
						id: item.id,
						pId: treeNode.id,
						title: item.is_leaf ? item.name : item.name.toUpperCase(),
						value: item.id,
						disabled: !item.is_leaf,
						isLeaf: item.is_leaf
					}])
				})
			})
			resolve()
		})
	}

	return (
		<TreeSelect
			treeDataSimpleMode
			placeholder={props.placeHolder}
			defaultValue={props.defaultValue}
			onChange={handleOnCategoryChangeEvent}
			loadData={handleOnCategoryLoad}
			treeData={categories}
		/>
	)
}
