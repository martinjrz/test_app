const express=require('express')
const bodyparser=require('body-parser')
const cookie_parser=require('cookie-parser')
const cors=require('cors')
const {graphqlHTTP}=require('express-graphql')
const {buildSchema}=require('graphql')


const server=express()
const port=process.env.PORT || 5000

server.use(bodyparser.json())
server.use(bodyparser.urlencoded({extended:true}))

server.use(cors())
server.use(cookie_parser())






server.use('/api',
graphqlHTTP((req,res)=>({
    schema:buildSchema(
        `
        type Rootquery{

        }
        type Rootmutation{

        }

        schema:{
            query:Rootquery
            mutation:Rootmutation
        }
        `
    ),
    rootValue:{
        //resolvers
    },
    graphiql:true
})))

server.listen(
port ,()=>{
    console.log('connected to the server at port %d',port)
}
)