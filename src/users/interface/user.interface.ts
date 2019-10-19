export interface UserData {
  fullName: string;
  username: string;
  password: string;
  email: string;
}

export interface UserRO {
  user: UserData;
}
