// Local files
import { fetchTrendingCategories } from '@/services/api'
import { TrendingCategoriesResponseData } from '@/@types/api'
import { FeedsPageInitials } from '@/@types/initializations'

export const getFeedsPageInitialValues = async (): Promise<FeedsPageInitials> => {
    let trendingCategories: TrendingCategoriesResponseData[]

    await fetchTrendingCategories().then(res => trendingCategories = res.data.attributes.categories)
        .catch((_error) => { })

    return { trendingCategories }
}