import React from 'react'
import App from 'next/app'
import 'isomorphic-fetch'
import '../public/style/main.less'

export default class extends App {
    static async getInitialProps({Component, router, ctx}) {
        const server = !!ctx.req
        const out = {server} as any

        if (Component.getInitialProps) {
            return {
                ...out,
                pageProps: {
                    ...await Component.getInitialProps(ctx)
                }
            }
        }

        return out
    }

    render() {
        const { props } = this as any
        const { Component, pageProps } = props

        return <Component {...pageProps} />
    }
}
