export interface ComponentProps {
	onImageTake: (base64Link: string, fileBlob: File) => void,
	onRemoveImage: () => void,
	defaultUrl: string
}
