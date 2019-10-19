export interface UserData {
  fullName: string;
  username: string;
  password: string;
  email: string;
  token: string;
}

export interface UserRO {
  user: UserData;
}
