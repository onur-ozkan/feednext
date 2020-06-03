// APP
export const API_URL = process.env.NODE_ENV !== 'production' ? 'https://server.feednext.io/api' : 'http://localhost/api'
export const SOCKET_URL = process.env.NODE_ENV !== 'production' ? 'https://server.feednext.io' : 'http://localhost'

// ROLES
export const Guest = -1
export const User = 0
export const JuniorAuthor = 1
export const MidLevelAuthor = 2
export const SeniorAuthor = 3
export const Admin = 4
export const SuperAdmin = 5
