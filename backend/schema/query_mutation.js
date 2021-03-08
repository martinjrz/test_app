const {buildSchema}=require('graphql')
const Schema=buildSchema(`
type Mobileuser{
username:String!
}
type Googleuser{
username:String!
}
type Rootquery{
getuser:Mobileuser!
readuser:String!
readnum:Int!
}

type Rootmutation{
createMobileuser(username:String!,mobile_no:String!,password:String!):Mobileuser!
createGoogleuser(username:String!,email:String!):Googleuser!
}
schema{
    query:Rootquery
    mutation:Rootmutation
}
`)

module.exports=Schema