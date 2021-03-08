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

require('./UserModel/mongoose_setup')



// require('./test')
// const {User,Post} = require('./testdb')

// server.use('/graphql',
// graphqlHTTP((request,response)=>({
// schema:buildSchema(
//         `
//         type User{
//             name:String!
//             userid:String!

//         }
//         type Post{
//             content:String!
//             id:String!
//         }
//         type Rootquery{
//         getuser:User!
//         getpost:[Post!]!
//         }
//         type Rootmutation{
//             createuser(name:String!):User!
//             createpost(content:String!):Post!

//         }

//         schema{
//             query:Rootquery
//             mutation:Rootmutation
//         }
//         `
//     ),
//     rootValue:{
//         //resolvers
//         createuser:({name})=>{
//             return new User({name:name}).save().then(res=>{
//                 const {name,_id}=res._doc
//                let userid=_id
//                 response.cookie('id',userid)
//                 return {name,userid}
//             })
//         },
//         createpost:({content})=>{
//         return new Post({content}).save().then(result=>{
//             const {content,_id}=result._doc
//             if(request.cookies.id)
//             {
//                 return Post.findByIdAndUpdate(_id,{user:request.cookies.id}).then(res=>{
//                 let id=request.cookies.id
//                 return User.findByIdAndUpdate(id,{$push:{posts:_id}}).then(res=>{
//                     return {content,id}
//                 })
//                 })
//             }
//         })
//         },
//         getuser:()=>{
//             const userid=request.cookies.id
//             return User.findById(userid).populate({path:'posts',select:'content -_id',"user":{$eq:userid}}).then(res=>{
//                 console.log(res)
//                 const {name,_id}=res._doc
//                 const userid=_id
//                 return {name,userid}
//             })
//         }
//     },
//     graphiql:true
// })))


server.listen(
port ,()=>{
    console.log('connected to the server at port %d',port)
}
)