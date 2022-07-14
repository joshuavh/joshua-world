import sanityClient from "@sanity/client"; // named import

//const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: 'jidqpryp',
  dataset: 'production',
  apiVersion: '2022-07-11', // use current UTC date - see "specifying API version"!
  token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
})