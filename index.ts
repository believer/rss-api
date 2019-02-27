import { GraphQLServer } from 'graphql-yoga'
import gql from 'graphql-tag'
import * as Parser from 'rss-parser'

const typeDefs = gql`
  type FeedItem {
    content: String!
    isoDate: String
    origin: String
    title: String!
  }

  input FeedInput {
    url: String!
    active: Boolean = true
  }

  type Query {
    feeds(feeds: [FeedInput!]!): [FeedItem]!
  }
`

const parser = new Parser()

interface FeedInput {
  active?: boolean
  url: string
}

const resolvers = {
  Query: {
    feeds: async (_, { feeds }: { feeds: FeedInput[] }) => {
      const filteredFeeds = feeds
        .filter(({ active }) => active)
        .map(({ url }) => parser.parseURL(url))

      const result = await Promise.all(filteredFeeds)

      return result
        .map(r => {
          return r.items.map(item => {
            const encoded = item['content:encoded']
            const isLongerEncoded =
              encoded && encoded.length > item.content.length

            return {
              ...item,
              content: isLongerEncoded ? encoded : item.content,
              origin: r.title
            }
          })
        })
        .reduce((acc, curr) => acc.concat(curr), [])
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on localhost:4000'))
