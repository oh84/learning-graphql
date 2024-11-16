const { readFileSync } = require('fs')
const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const { ApolloServer } = require('apollo-server-express')
const { MongoClient } = require('mongodb')
require('dotenv').config()

async function start() {
  const MONGO_DB = process.env.DB_HOST
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true })
  const db = client.db()

  const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
  const resolvers = require('./resolvers')
  const context = { db }
  const server = new ApolloServer({ typeDefs, resolvers, context })

  const app = express()

  server.applyMiddleware({ app })

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'))
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  })
}

start()
