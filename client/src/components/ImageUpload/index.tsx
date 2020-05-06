import React, { useState } from 'react'
import { message, Upload, Button } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

const ImageUpload: React.FC = ({ onImageTake, onRemoveImage, defaultUrl }): JSX.Element => {
	const [isImageLoading, setIsImageLoading] = useState(false)
	const [base64, setBase64] = useState(defaultUrl)

	const getBase64 = (image: File, callback: Function): void => {
		const reader = new FileReader()
		reader.addEventListener('load', () => callback(reader.result))
		reader.readAsDataURL(image)
	}

	const handleOnUpload = (info: any): void => {
		if (info.file.status === 'uploading') {
			setIsImageLoading(true)
			return
		}

		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (base64Url: string) => {
				setIsImageLoading(false)
				setBase64(base64Url)
				onImageTake(base64Url, info.file.originFileObj)
			})
		}
	}

	const fileValidation = (file: File): boolean => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) message.error('You can only upload JPG/PNG file!')

		const isBiggerThan2Mb = file.size / 1024 / 1024 > 2
		if (isBiggerThan2Mb) message.error('Image must smaller than 2MB!')

		return isJpgOrPng && !isBiggerThan2Mb
	}

	const uploadButton = (
		<div>
			{isImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
			<div className="ant-upload-text"> Upload </div>
		</div>
	)

	const handleOnPictureDelete = (): void => {
		setBase64(null)
		onRemoveImage()
	}

	return (
		<Upload
			name="avatar"
			disabled={!!base64}
			listType="picture-card"
			className="avatar-uploader"
			beforeUpload={fileValidation}
			showUploadList={false}
			onChange={handleOnUpload}
		>
			{(base64) ?
				(
					<div
						style={{
							position: 'relative',
							minHeight: 132,
							maxHeight: 132,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<img src={base64} style={{ width: '100%' }} />
						<Button
							style={{
								position: 'absolute',
								bottom: -15,
								zIndex: 1
							}}
							onClick={handleOnPictureDelete}
							type="link"
							icon={<DeleteOutlined/>}
							danger
						/>

					</div>
				)
				:
				(uploadButton)
			}
		</Upload>
	)
}

export default ImageUpload
