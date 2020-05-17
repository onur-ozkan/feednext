// Other dependencies
import React from 'react'
import { Helmet } from 'react-helmet'

// Local files
import { ComponentProps } from './types'

export const PageHelmet = (props: ComponentProps): JSX.Element => {
	return (
		<>
			<Helmet>
				<title> {props.title} </title>
				<meta name="application-name" content="Feednext" />
				<meta name="description" content={props.description} />
				<meta name="keywords" content={props.keywords} />
				<meta property="twitter:card" content="summary" />
				{props.keywords && <meta name="keywords" content={props.keywords} /> }
				{props.author && <meta name="author" content={props.author} /> }
				<meta property="twitter:site" content="@feednext" />
				<meta property="og:type" content="article" />
				<meta property="og:site_name" content="Feednext" />
				<meta property="og:locale" content="en_EN" />
			</Helmet>

			{props.mediaTitle &&
				<Helmet>
					<meta property="twitter:title" content={props.mediaTitle} />
					<meta property="og:title" content={props.mediaTitle} />
				</Helmet>
			}

			{props.mediaDescription &&
				<Helmet>
					<meta property="twitter:description" content={props.mediaDescription} />
				</Helmet>
			}

			{props.mediaImage &&
				<Helmet>
					<meta property="twitter:image" content={props.mediaImage} />
					<meta property="og:image" content={props.mediaImage} />
				</Helmet>
			}
		</>
	)
}
