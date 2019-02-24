const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')

const app = express()

app.use(bodyParser.json())

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster-one-sep7q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => app.listen(3000))
  .catch(e => console.log(e))
