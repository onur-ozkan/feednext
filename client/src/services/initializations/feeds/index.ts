// Local files
import { fetchTrendingTags } from '@/services/api'
import { TrendingTagsResponseData } from '@/@types/api'
import { FeedsPageInitials } from '@/@types/initializations'

export const getFeedsPageInitialValues = async (): Promise<FeedsPageInitials> => {
    let trendingTags: TrendingTagsResponseData[]

    await fetchTrendingTags().then(res => trendingTags = res.data.attributes.tags)
        .catch((_error) => { })

    return { trendingTags }
}