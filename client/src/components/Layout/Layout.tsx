import * as React from 'react'
import { HeaderSection } from '../Header/Header'
import {Footer} from '../Footer/Footer'
import Head from 'next/head'

export const Layout: React.FunctionComponent = props =>
  <div id="layout">
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
    </Head>
    <HeaderSection/>
    <main>
      {props.children}
    </main>
    <Footer/>
  </div>
