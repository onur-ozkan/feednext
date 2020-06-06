export interface GetUserDataResponse {
    type: 'user_profile',
    attributes: {
        'id': string,
        'full_name': string,
        'username': string,
        'email': string,
        'link': string,
        'biography': string,
        'role': number,
        'created_at': string,
        'updated_at': string
    }
}
