
export interface userLogin {
    message: string,
    accessToken: string,
    userdata:UserD
}

export interface UserD {
    userid: string;       
    username: string;
    email: string;
    password:string;
  }

  export interface getUsers{
    users: Array<UserD>
  }
