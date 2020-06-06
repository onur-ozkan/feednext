import { API_URL } from '@/../config/constants'
import { FeedList } from '@/@types/pages'
import { fetchTrendingCategories, fetchAllFeeds, fetchOneCategory, fetchFeaturedEntryByTitleId } from '@/services/api'
import { TrendingCategoriesResponseData } from '@/@types/api'
import { FeedsPageInitials } from '@/@types/initializations'

export const getFeedsPageInitialValues = async (): Promise<FeedsPageInitials> => {
    let trendingCategories: TrendingCategoriesResponseData[]
    let canLoadMore: boolean
    let feedList: FeedList[] = []

    await fetchTrendingCategories().then(res => trendingCategories = res.data.attributes.categories)
        .catch((_error) => { })
    await fetchAllFeeds(0, undefined, undefined, undefined)
        .then(async (feedsResponse) => {
            if (feedsResponse.data.attributes.count > feedList.length) canLoadMore = true
            else canLoadMore = false

            const promises = await feedsResponse.data.attributes.titles.map(async (title: any) => {
                const categoryName = await fetchOneCategory(title.category_id).then(({ data }) => data.attributes.name)
                    .catch((_error) => { })
                const featuredEntry: any = await fetchFeaturedEntryByTitleId(title.id).then(featuredEntryResponse => featuredEntryResponse.data.attributes)
                    .catch(_error => { })

                const feed = {
                    id: title.id,
                    slug: title.slug,
                    name: title.name,
                    href: `/${title.slug}`,
                    categoryName: categoryName,
                    createdAt: title.created_at,
                    updatedAt: title.updated_at,
                    entryCount: title.entry_count,
                    ...featuredEntry && {
                        featuredEntry: {
                            id: featuredEntry.id,
                            avatar: `${API_URL}/v1/user/pp?username=${featuredEntry.written_by}`,
                            text: featuredEntry.text,
                            createdAt: featuredEntry.created_at,
                            updatedAt: featuredEntry.updated_at,
                            voteValue: featuredEntry.votes.value,
                            writtenBy: featuredEntry.written_by,
                        }
                    }
                }
                return feed
            })

            const result = await Promise.all(promises)
            result.map(item => feedList.push(item))
        }).catch((_error) => { })

    return {
        trendingCategories,
        canLoadMore,
        feedList
    }
}