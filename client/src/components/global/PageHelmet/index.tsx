// Other dependencies
import React from 'react'
import Head from 'next/head'

// Local files
import { ComponentProps } from '@/@types/components'

export const PageHelmet = (props: ComponentProps): JSX.Element => {
	return (
		<>
			<Head>
				<title> {props.title} </title>
				<meta name="description" content={props.description} />
				{props.keywords && <meta name="keywords" content={props.keywords} /> }
				{props.author && <meta name="author" content={props.author} /> }
			</Head>

			{props.mediaTitle &&
				<Head>
					<meta property="twitter:title" content={props.mediaTitle} />
					<meta property="og:title" content={props.mediaTitle} />
				</Head>
			}

			{props.mediaDescription &&
				<Head>
					<meta property="twitter:description" content={props.mediaDescription} />
				</Head>
			}

			{props.mediaImage &&
				<Head>
					<meta property="twitter:image" content={props.mediaImage} />
					<meta property="og:image" content={props.mediaImage} />
				</Head>
			}
		</>
	)
}
