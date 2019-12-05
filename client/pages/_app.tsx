import React from 'react'
import App from 'next/app'
import { Provider } from 'react-redux'
import { getStore } from '../src/store'
import 'isomorphic-fetch'
import '../public/main.less'

export default class extends App {
    static async getInitialProps({Component, router, ctx}) {
        const server = !!ctx.req
        const store = getStore(undefined, server)
        const state = store.getState()
        const out = {state, server} as any

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

        return (
            <Provider store={getStore(undefined, props.server)}>
                <Component {...pageProps} />
            </Provider>
        )
    }
}
