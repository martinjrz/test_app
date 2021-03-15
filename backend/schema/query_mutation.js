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
type checker{
    isauthen:String!
}
type Rootquery{
signedInMobileusers(mobile_no:String!,pass:String!):Mobileuser!
signedInGoogleusers(email:String!):Googleuser!
getmobileuser:_user1!
getgoogleuser:_user1!
logout_:String!
}
type Cn_{
    cn_value:Int!
    uV_:String!
}
type Rootmutation{
createMobileuser(username:String!,mobile_no:String!,password:String!):Mobileuser!
createGoogleuser(username:String!,email:String!):Googleuser!
addtocarter(cn__value:Int!):Cn_!
}
schema{
    query:Rootquery
    mutation:Rootmutation
}
`)

module.exports=Schema