import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import config from "config"

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
    type Image {
        id: String
        width: Int
        height: Int
        url: String
    }
    
    type Measurement {
        imperial: String
        metric: String
    }
    
    type Cat {
        id: String
        name: String
        temperament: String
        origin: String
        country_codes: String
        country_code: String
        description: String
        life_span: String
        indoor: Int
        lap: Int
        alt_names: String
        adaptability: Int
        affection_level: Int
        child_friendly: Int
        dog_friendly: Int
        energy_level: Int
        grooming: Int
        health_issues: Int
        intelligence: Int
        shedding_level: Int
        social_needs: Int
        stranger_friendly: Int
        vocalisation: Int
        experimental: Int
        hairless: Int
        natural: Int
        rare: Int
        rex: Int
        suppressed_tail: Int
        short_legs: Int
        wikipedia_url: String
        hypoallergenic: Int
        reference_image_id: String
        image: Image
        weight: Measurement
    }
  
    type Dog {
        id: Int
        name: String
        bred_for: String
        breed_group: String
        life_span: String
        temperament: String
        reference_image_id: String
        image: Image
        height: Measurement
        weight: Measurement
      }
  
    type Query {
        dogs: [Dog]
        cats: [Cat]
    }
`)

// The root provides a resolver function for each API endpoint
const root = {
    dogs: async () => {
        const apiKey = config.get<string>('dogApiKey')
        const url = `https://api.thedogapi.com/v1/breeds`;
        const response = await fetch(url,{ headers: {
            'x-api-key': apiKey
        }} )
        const data = await response.json()
        return data
    },
    cats: async () => {
        const apiKey = config.get<string>('catApiKey')
        const url = `https://api.thecatapi.com/v1/breeds`;
        const response = await fetch(url,{ headers: {
            'x-api-key': apiKey
        }} )
        const data = await response.json()
        return data
    },
}

const app = express()
app.use(
    "/pets",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")