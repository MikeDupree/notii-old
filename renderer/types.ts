/*
 {
    "data": {
        "user": {
            "name": "Mike Dupree",
            "email": "mikerdupree@gmail.com",
            "image": "https://lh3.googleusercontent.com/a/AGNmyxaz2Sqkzdyok7raXFekIEcmQ7ctTy5wCt-ACmr8=s96-c",
            "picture": "https://lh3.googleusercontent.com/a/AGNmyxaz2Sqkzdyok7raXFekIEcmQ7ctTy5wCt-ACmr8=s96-c",
            "sub": "116024298974383632743",
            "iat": 1680414140,
            "exp": 1683006140,
            "jti": "4e1a58d9-2ae1-4c87-88eb-65ff26c0a46e"
        },
        "expires": "2023-05-02T05:42:21.732Z"
    },
    "status": "authenticated"
    }
 */

export interface User {
  name: string;
  email: string;
  image: string;
  picture: string;
  sub: string;
  iat?: string;
  exp?: string;
  jti?: string;
}
