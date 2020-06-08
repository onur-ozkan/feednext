// Other dependencies
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="icon" type="image/png" href="/favicon.ico" />
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="application-name" content="Feednext" />
                    <meta property="twitter:card" content="summary" />
                    <meta property="twitter:site" content="@feednext" />
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Feednext" />
                    <meta property="og:locale" content="en_EN" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
