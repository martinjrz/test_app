const express=require('express')

const bodyparser=require('body-parser')
const cookie_parser=require('cookie-parser')
const cors=require('cors')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')

const {graphqlHTTP}=require('express-graphql')
// const {buildSchema}=require('graphql')

require('./UserModel/mongoose_setup')

const server=express()
const port=process.env.PORT || 5000

server.use(bodyparser.json())
server.use(bodyparser.urlencoded({extended:true}))


server.use(cors(
    {
        credentials:true,
        origin:"http://localhost:3000",
        methods:['post','put','get','delete']
    }
))

const secretkey=`asdfadsfdfk@&*%&^%^
*@&*&dhfhadsjfh
a&^&*^%&%^&766767
6123GH&&
^&%*dshfdshg`
const createToken=async (_id,secretkey,_expt)=>{
 return await jwt.sign({_id_:_id},secretkey,{expiresIn:_expt})
   
}

server.use(cookie_parser())

const {Mobileuser}=require('./UserModel/user_schema')
const {Googleuser}=require('./UserModel/google_user_schema')

const Schema=require('./schema/query_mutation')

server.use('/graphqlserver',
graphqlHTTP((request,response)=>({
    schema:Schema,
    graphiql:true,
    rootValue:{

        //create mobile user
        createMobileuser:({username,password,mobile_no})=>{
        
            try{
                return Mobileuser.findOne({phone_no:mobile_no}).then(user=>{
                    if(user)
                    {
                    throw new Error('user is already created!')
                    }
                    else {
                       return bcryptjs.genSalt(12).then(salt=>{
                          return   bcryptjs.hash(password,salt).then(hashedpassword=>{
                                return new Mobileuser({ 
                                    username:username,
                                    password:hashedpassword,
                                    phone_no:mobile_no}).save().then(res=>{
                                    const {username}=res._doc
                                    return {username}
                                    })
                            })
                        })   
                    }  
                })
            }
            catch(err){
                console.log(err)
                throw err
            }
        },
        //signed in mobile users
        signedInMobileusers:({mobile_no,pass})=>{
            try{
                return Mobileuser.findOne({phone_no:mobile_no}).then(founduser=>{
                    if(founduser){
                        const {password,username,_id}=founduser._doc
                       return bcryptjs.compare(pass,password).then(ismatched=>{
                            if(ismatched)
                            {
                                console.log('matched')
                              return createToken(_id,secretkey,'10h').then(res=>{
                              response.cookie('__rt',res,{httpOnly:true,sameSite:'lax',maxAge:36000000})
                              return Mobileuser.findByIdAndUpdate(_id,{$push:{refreshToken:res}}).then(()=>{
                              return  createToken(_id,secretkey,'1h').then(res=>{
                              response.cookie('__atidk',res,{httpOnly:true,sameSite:'lax',maxAge:360000})
                              return {username}
                         })
                                 
                              })
                          }) 
                            }
                            else return {username:"wrong password"}
                        })
                    }
                    else {
                        return {username:'mobile_no not found'}
                    }
                })
            }
            catch(err)
            {
                throw new Error(err)
            }
        },
        // signed in google users
        signedInGoogleusers:async({email})=>{
            try{
                return Googleuser.findOne({email:email}).then(result=>{
                    if(result)
                    {
                        const {username,_id}=result._doc 
                        return createToken(_id,secretkey,'10h').then(rt=>{
                        response.cookie('__rt',rt,{httpOnly:true,sameSite:'lax',maxAge:36000000})
                        return Googleuser.findByIdAndUpdate(_id,{$push:{refreshToken:rt}}).then(()=>{
                        return createToken(_id,secretkey,'1h').then(at=>{ 
                        response.cookie('__atidk',at,{httpOnly:true,sameSite:'lax',maxAge:3600000})
                        return {username}
                            })
                         })
                        })
                    }
                    else {
                        return {username:'email not found'}
                    }
                })
            }catch(err)
            {
                throw new Error(err)
            }
                },
                //creation of google users;
        createGoogleuser:({email,username})=>{
            try{
             return  Googleuser.findOne({email:email}).then(result=>{
                    if(result)
                    {
                        throw new Error('user is already taken')
                    }
                    else {
                        return new Googleuser({
                            email:email,
                            username:username
                        })
                        .save()
                        .then(_saved_user=>{
                            console.log(_saved_user)
                            const {username}=_saved_user._doc
                            console.log(username)
                            return {username}
                        })
                    }
                })
            }
            catch(err){
                throw new Error(err)
            }
        },
        //get mobile users 
        getmobileuser:()=>{
            try{
                const {__rt,__atidk} =request.cookies || null
                if(__rt &&__atidk)
                {
                   return  jwt.verify(__rt,secretkey,(err,result)=>{
                        if(err)
                        return {username:'false',cart_value:0}
                        if(!result)
                        {
                            return {username:'false',cart_value:0}
                        }
                        else{
                            const {_id_}=result
                            return Mobileuser.findById({_id:_id_}).then((result)=>{
                                if(result){
                                    console.log(result)
                                    const {username,cart_value,refreshToken}=result._doc
                                    if(refreshToken.includes(__rt))
                                    {
                                        return  jwt.verify(__atidk,secretkey,(err,result_1)=>{
                                            if(err)
                                            {
                                                if(err.message==='invalid token' ||
                                                 err.message==='jwt malformed' ||
                                                 err.message==='jwt signature is required'||
                                                 err.message==='invalid signature'
                                                 )
                                                return {username:err.message,cart_value:0}
                                                return createToken(_id_,secretkey,'1h').then(res=>{
                                                response.cookie('__atidk',res,{httpOnly:true,sameSite:"lax",maxAge:3600000})
                                                return {username:username,cart_value:cart_value}
                                                })
                                               
                                            }
                                            if(!result_1)
                                            {
                                                return {username:'false',cart_value:0}
                                            }
                                            else{
                                               return {username:username,cart_value:cart_value}
                                            }
                                        })
                                    }
                                    else{
                                        return {username:'false',cart_value:0}
                                    }
                                 
                                }
                                else {
                                    return {username:'false',cart_value:0}
                                }
                            })
                        
                        }
                        
               
                   })
                }
               // if only accesstoken is available
                 if(__rt && !__atidk)
                  {
                    return jwt.verify(__rt,secretkey,(err,res)=>{
                        if(err)
                        {
                            return {username:'false',cart_value:0}
                        }
                        if(res){
                            const {_id_}=res
                            console.log(_id_)
                            return Mobileuser.findById({_id:_id_}).then(userfound=>{
                                if(userfound){
                                  
                                    const {username,cart_value,refreshToken,_id}=userfound._doc
                                    if(refreshToken.includes(__rt)){
                                        return  createToken(_id,secretkey,'1h').then(result=>{
                                        response.cookie('__atidk',result,{httpOnly:true,sameSite:"lax",maxAge:3600000})
                                        return {username:username,cart_value:cart_value}
                                        })
                                    }else{
                                      
                                        return {username:'false',cart_value:0}
                                    }
                                    }
                                    else {
                                        return {username:'false',cart_value:0}
                                }
                            })
                        }
                    }) 
                }
                else{
                    return {username:'false',cart_value:0}
                }
          
            }
            catch(err)
            {
                throw new Error(err)
            }
        },
        //get googleusers
        getgoogleuser:()=>{
            const {__rt,__atidk} =request.cookies || null
            try{
                if(__rt && __atidk)
                {
                    return jwt.verify(__rt,secretkey,(err,verified_rt)=>{
                        if(err)
                        {
                           return {username:'false',cart_value:0}
                        }
                       else if(!verified_rt)
                        {
                           return {username:'false',cart_value:0}
                        }
                        else 
                        {
                            const {_id_}=verified_rt
                            return Googleuser.findById({_id:_id_}).then(_rt_user=>{
                               if(_rt_user)
                                {
                                    const {username,cart_value,refreshToken,_id}=_rt_user._doc
                                    if(refreshToken.includes(__rt))
                                    {
                                       return jwt.verify(__atidk,secretkey,(err,verified_at)=>{
                                            if(err)
                                            {
                                                
                                                if(err.message==='invalid token' ||
                                                 err.message==='jwt malformed' ||
                                                 err.message==='jwt signature is required'||
                                                 err.message==='invalid signature'
                                                 )
                                                 {
                                                     return {username:err.message,cart_value:0}
                                                    }
                                                return createToken(_id,secretkey,'1h').then(newtoken=>{
                                                    console.log(username)
                                                    response.cookie('__atidk',newtoken,{httpOnly:true,sameSite:"lax"})
                                                    return {username:username,cart_value:cart_value}
                                                })
                                            }
                                            else if(!verified_at)
                                            {
                                                return {username:'false',cart_value:0}
                                            }
                                            else 
                                            return {username:username,cart_value:cart_value}
                                        })
                                    }
                                    
                                }
                                else{
                                    return {username:'false',cart_value:0}
                                }
                            })
                        }
                    })
                }
                else if(!__atidk && __rt)
                {
                    return jwt.verify(__rt,secretkey,(err,res)=>{
                        if(err)
                        {
                            return {username:'false',cart_value:0}
                        }
                        if(res){
                            const {_id_}=res
                            return Googleuser.findById({_id:_id_}).then(userfound=>{
                                if(userfound){
                                    const {username,cart_value,refreshToken,_id}=userfound._doc
                                    if(refreshToken.includes(__rt)){
                                        return  createToken(_id,secretkey,'1h').then(result=>{
                                        response.cookie('__atidk',result,{httpOnly:true,sameSite:"lax",maxAge:3600000})
                                        return {username:username,cart_value:cart_value}
                                        })
                                    }else{
                                        console.log('invalid refreshtoken')
                                        throw new Error('invalid refreshtoken')
                                    }
                                    }
                                    else {
                                        return {username:'false',cart_value:0}
                                }
                            })
                        }
                    })
                }
                else {
                    return {username:'false',cart_value:0}
                }
            }
            catch(err)
            {
                return {username:'false',cart_value:0}
            }
        },
        logout_:async()=>{
            const {__rt,__atidk,mb_}=request.cookies
            if(__rt && __atidk && mb_){
            const payload=await jwt.verify(__rt,secretkey,async (err,payload)=>{
                if(err)
                    return err.message 
                else if(payload) {
                    await response.clearCookie('__rt')
                   await response.clearCookie('__atidk')
                    await response.clearCookie('mb_')
                    return 'verified'
                }
                else return 'null'
            })
             return payload
            }
        }

    }
    
})))


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