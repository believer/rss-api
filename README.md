# A test of a RSS reader API

## Try it

```bash
$ npm install
$ npm run dev
```

Open http://localhost:4000

## Example query

```graphql
query getFeeds($feeds: [FeedInput!]!) {
  feeds(feeds: $feeds) {
    origin
    title
    isoDate
    content
  }
}
```

### Query variables

```json
{
  "feeds": [
    { "url": "https://reactjs.org/feed.xml", "active": false },
    { "url": "https://www.alfredapp.com/blog/feed.xml", "active": false },
    { "url": "https://overreacted.io/rss.xml" }
  ]
}
```
