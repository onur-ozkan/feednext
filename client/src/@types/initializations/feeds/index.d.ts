// Local files
import { TrendingCategoriesResponseData } from '@/@types/api'
import { FeedList } from '@/@types/pages'

export interface FeedsPageInitials {
    trendingCategories: TrendingCategoriesResponseData[],
    feedList: FeedList[],
    canLoadMore: boolean
}