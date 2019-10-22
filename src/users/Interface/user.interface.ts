export interface UserData {
  fullName: string;
  username: string;
  password: string;
  email: string;
  accessToken: string;
}

export interface UserRO {
  user: UserData;
}
