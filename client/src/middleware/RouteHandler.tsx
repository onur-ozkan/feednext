import React from 'react'
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect } from 'umi'
import { stringify } from 'querystring'
import { ConnectProps } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import { getAuthorityFromRouter } from '@/utils/utils'
import { User } from '@/../config/constants'

declare interface RouteHandlerProps extends ConnectProps {
	loading?: boolean
	currentUser?: CurrentUser
}

declare interface RouteHandlerState {
	isReady: boolean
}

class RouteHandler extends React.Component<RouteHandlerProps, RouteHandlerState> {
	state: RouteHandlerState = {
		isReady: false,
	}

	componentDidMount(): void {
		this.setState({
			isReady: true,
		})
		const { dispatch } = this.props
		if (dispatch) {
			dispatch({
				type: 'user/fetchCurrent',
			})
		}
	}

	render(): React.ReactNode {
		const { isReady } = this.state
		const { children, loading, currentUser, route } = this.props
		// You can replace it to your authentication rule (such as check token exists)
		// 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
		const isLogin = currentUser && currentUser.userid
		const queryString = stringify({
			redirect: window.location.href,
		})

		const authorized: any = getAuthorityFromRouter(route?.routes, location.pathname || '/')

		if ((!isLogin && loading) || !isReady) {
			return <PageLoading />
		}

		if (!isLogin && window.location.pathname !== '/auth/sign-in' && authorized.authority >= User) {
			return <Redirect to={`/auth/sign-in?${queryString}`} />
		}

		return children
	}
}

export default RouteHandler
