const { readFileSync } = require('fs')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
require('dotenv').config()

async function start() {
  const client = await MongoClient.connect(process.env.DB_HOST)
  const db = client.db()

  const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
  const resolvers = require('./resolvers')

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization
      const currentUser = await db.collection('users').findOne({ githubToken })
      return { db, currentUser }
    },
  })

  const app = express()

  server.applyMiddleware({ app })

  app.get('/', (req, res) => {
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`
    const html = `
      <a href="${githubUrl}">Sign In with GitHub</a> | 
      <a href="/playground">GraphQL Playground</a> | 
      <a href="http://localhost:8081/">Mongo Express</a>
    `
    res.end(html)
  })
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  })
}

start()
