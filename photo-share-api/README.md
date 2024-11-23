# photo-share-api

## セットアップ

MongoDB と Mongo Express (MongoDBをブラウザの画面から操作できるアプリみたいです) を Docker Compose で起動します。
GraphQL サーバーはローカルのマシン上で起動します。
MongoDB 起動時に下記の処理が実行されて初期データが投入されます (参考: https://qiita.com/r1wtn/items/c18e14375bbaa564e289) 。

- `photo-share-api-db` データベースの作成
- `photo-share-api-user` ユーザーの作成
- `users`, `tags`, `photos` コレクションの作成とデータ投入

### 起動手順

1. `cp .env.example .env` でコピーして環境変数を設定
2. MongDB 起動: `docker compose up -d`
3. npm パッケージインストール: `npm install`
4. GraphQL サーバー起動: `npm start`
5. http://localhost:4000/ にアクセス

### 初期データが投入されない場合

Mongo Express (http://localhost:8081) をブラウザで開き、 `data/mongo/init` 内の .json ファイルを使用して手動でデータを投入してください。

- `photo-share-api-db` データベースの作成
  - Database Name に `photo-share-api-db` を入力して Create Database をクリック
- `photo-share-api-user` ユーザーの作成
  - `admin` データベースの `system.users` コレクションを開いて New Document をクリック
  - `photo-share-api-user.json` の内容を貼り付けて Save をクリック
- `users`, `tags`, `photos` コレクションの作成とデータ投入
  - `photo-share-api-db` データベースを開いて Collection Name に `users/tags/photos` をそれぞれ入力して Create collection をクリック
  - 各コレクションの Import ボタンをクリックして `users.json/tags.json/photos.json` をそれぞれ選択してデータを投入

## クエリメモ

セットアップ完了後、GraphQL Playground (http://localhost:4000/playground) から以下のクエリが実行できます。

---

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
