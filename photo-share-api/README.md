# photo-share-api

## セットアップ

1. `cp .env.example .env` でコピーして環境変数を設定
2. MongDB起動: `docker compose up -d`
3. GraphQLサーバー起動: `npm start`
4. http://localhost:4000/ にアクセス

## クエリメモ

```graphql
query {
  me {
    githubLogin
    name
    avatar
  }
}
```

HTTP HEADERS

```json
{
  "Authorization": "5ec00b11ea697b1eb9e585004d8fe0d47d738c14"
}
```

---

```graphql
query {
  totalPhotos
}
```

---

```graphql
query {
  allPhotos {
    id
    url
    name
    description
    category
    postedBy {
      githubLogin
    }
    taggedUsers {
      githubLogin
    }
    created
  }
}
```

---

```graphql
query {
  Photo(id: "673966b4946bf45b844643d0") {
    name
    postedBy {
      githubLogin
    }
    taggedUsers {
      githubLogin
    }
  }
}
```

---

```graphql
query {
  totalUsers
}
```

---

```graphql
query {
  allUsers {
    githubLogin
    name
    postedPhotos {
      name
    }
    inPhotos {
      name
    }
  }
}
```

---

```graphql
query {
  User(githubLogin: "bigfish130") {
    name
    postedPhotos {
      name
    }
    inPhotos {
      name
    }
  }
}
```

---

```graphql
mutation ($input: PostPhotoInput!) {
  postPhoto(input: $input) {
    id
    url
    postedBy {
      githubLogin
    }
    taggedUsers {
      githubLogin
    }
  }
}
```

QUERY VARIABLES

```json
{
  "input": {
    "name": "sample photo A",
    "description": "A sample photo for our dataset",
    "category": "SELFIE"
  }
}
```

HTTP HEADERS

```json
{
  "Authorization": "5ec00b11ea697b1eb9e585004d8fe0d47d738c14"
}
```

---

```graphql
mutation {
  tagPhoto(userID: "goldenleopard731", photoID: "673966b4946bf45b844643cf") {
    name
    postedBy {
      githubLogin
    }
    taggedUsers {
      githubLogin
    }
  }
}
```

---

```graphql
# code を取得するための URL:
# https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user

mutation {
  githubAuth(code: "${code}") {
    token
    user {
      githubLogin
      name
      avatar
      postedPhotos {
        name
      }
      inPhotos {
        name
      }
    }
  }
}
```

---

```graphql
mutation {
  addFakeUsers(count: 3) {
    githubLogin
    name
    avatar
  }
}
```

---

```graphql
mutation {
  fakeUserAuth(githubLogin: "reddog780") {
    token
  }
}
```
