const users = [
  {
    user: 'photo-share-api-user',
    pwd: 'password',
    roles: [
      {
        role: 'dbOwner',
        db: 'photo-share-api-db',
      },
    ],
  },
];

for (const user of users) {
  db.createUser(user);
}
