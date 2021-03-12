const {buildSchema}=require('graphql')
const Schema=buildSchema(`
union _Mobile_user = Mobileuser | Server_error

type Mobileuser{
username:String!
}
type Googleuser{
username:String!
}
type Server_error{
    error:String!
}
type _user1{
    username:String!
    cart_value:Int!

}
type Rootquery{
signedInMobileusers(mobile_no:String!,pass:String!):Mobileuser!
signedInGoogleusers(email:String!):Googleuser!
getmobileuser:_user1!
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