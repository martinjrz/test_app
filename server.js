const express = require("express");

const bodyparser = require("body-parser");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path=require('path')
const { graphqlHTTP } = require("express-graphql");
// const {buildSchema}=require('graphql')

require("./backend/UserModel/mongoose_setup");

const server = express();
const port = process.env.PORT || 5000;

server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: true }));

// server.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000",
//     methods: ["post", "put", "get", "delete"],
//   })
// );

const secretkey = `asdfadsfdfk@&*%&^%^
*@&*&dhfhadsjfh
a&^&*^%&%^&766767
6123GH&&
^&%*dshfdshg`;
const createToken = async (_id, secretkey, _expt) => {
  return await jwt.sign({ _id_: _id }, secretkey, { expiresIn: _expt });
};

server.use(cookie_parser());

const { Mobileuser } = require("./backend/UserModel/user_schema");
const { Googleuser } = require("./backend/UserModel/google_user_schema");

const Schema = require("./backend/schema/query_mutation");

server.use(
  "/graphqlserver",
  graphqlHTTP((request, response) => ({
    schema: Schema,
    graphiql:true,
    rootValue: {
      //create mobile user
      createMobileuser: ({ username, password, mobile_no }) => {
        try {
          return Mobileuser.findOne({ phone_no: mobile_no }).then((user) => {
            if (user) {
              return { username: "mobile no. is already in use" };
            } else {
              return bcryptjs.genSalt(12).then((salt) => {
                return bcryptjs.hash(password, salt).then((hashedpassword) => {
                  return new Mobileuser({
                    username: username,
                    password: hashedpassword,
                    phone_no: mobile_no,
                  })
                    .save()
                    .then((res) => {
                      const { username } = res._doc;
                      return { username };
                    });
                });
              });
            }
          });
        } catch (err) {
          return { username: "server error" };
        }
      },
      //signed in mobile users
      signedInMobileusers: ({ mobile_no, pass }) => {
        try {
          return Mobileuser.findOne({ phone_no: mobile_no }).then(
            (founduser) => {
              if (founduser) {
                const { password, username, _id } = founduser._doc;
                return bcryptjs.compare(pass, password).then((ismatched) => {
                  if (ismatched) {
                    console.log("matched");
                    return createToken(_id, secretkey, "10h").then((res) => {
                      response.cookie("__rt", res, {
                        httpOnly: true,
                        sameSite: "lax",
                        maxAge: 36000000,
                        secure:true
                      });
                      return Mobileuser.findByIdAndUpdate(_id, {
                        $push: { refreshToken: res },
                      }).then(() => {
                        return createToken(_id, secretkey, "1h").then((res) => {
                          response.cookie("__atidk", res, {
                            httpOnly: true,
                            sameSite: "lax",
                            maxAge: 360000,
                            secure:true
                          });
                          return { username };
                        });
                      });
                    });
                  } else return { username: "wrong password" };
                });
              } else {
                return { username: "mobile_no not found" };
              }
            }
          );
        } catch (err) {
          return { username: "server error" };
        }
      },
      // signed in google users
      signedInGoogleusers: async ({ email }) => {
        try {
          return Googleuser.findOne({ email: email }).then((result) => {
            if (result) {
              const { username, _id } = result._doc;
              return createToken(_id, secretkey, "10h").then((rt) => {
                response.cookie("__rt", rt, {
                  httpOnly: true,
                  sameSite: "lax",
                  maxAge: 36000000,
                  secure:true
                });
                return Googleuser.findByIdAndUpdate(_id, {
                  $push: { refreshToken: rt },
                }).then(() => {
                  return createToken(_id, secretkey, "1h").then((at) => {
                    response.cookie("__atidk", at, {
                      httpOnly: true,
                      sameSite: "lax",
                      maxAge: 3600000,
                      secure:true
                    });
                    return { username };
                  });
                });
              });
            } else {
              return { username: "email not found" };
            }
          });
        } catch (err) {
          return { username: "server error" };
        }
      },
      //creation of google users;
      createGoogleuser: ({ email, username }) => {
        try {
          return Googleuser.findOne({ email: email }).then((result) => {
            if (result) {
              return { username: "gmail is already in use" };
            } else {
              return new Googleuser({
                email: email,
                username: username,
              })
                .save()
                .then((_saved_user) => {
                  console.log(_saved_user);
                  const { username } = _saved_user._doc;
                  console.log(username);
                  return { username };
                });
            }
          });
        } catch (err) {
          return { username: "server error" };
        }
      },
      //get mobile users
      getmobileuser: () => {
        try {
          const { __rt, __atidk, mb_ } = request.cookies || null;
          if (__rt && __atidk && mb_) {
            return jwt.verify(__rt, secretkey, (err, result) => {
              if (err) {
                remove_cookie(response)
                return { username: "false", cart_value: 0 };
              }
              if (!result) {
                return { username: "false", cart_value: 0 };
              } else {
                const { _id_ } = result;
                return Mobileuser.findById({ _id: _id_ }).then((result) => {
                  if (result) {
                    const { username, cart_value, refreshToken } = result._doc;
                    if (refreshToken.includes(__rt)) {
                      return jwt.verify(__atidk, secretkey, (err, result_1) => {
                        if (err) {
                          return createToken(_id_, secretkey, "1h").then(
                            (res) => {
                              response.cookie("__atidk", res, {
                                httpOnly: true,
                                sameSite: "lax",
                                maxAge: 3600000,
                                secure:true
                              });
                              return {
                                username: username,
                                cart_value: cart_value,
                              };
                            }
                          );
                        }
                        if (!result_1) {
                          return { username: "false", cart_value: 0 };
                        } else {
                          return { username: username, cart_value: cart_value };
                        }
                      });
                    } else {
                      return { username: "false", cart_value: 0 };
                    }
                  } else {
                    remove_cookie(response)
                    return { username: "false", cart_value: 0 };
                  }
                });
              }
            });
          }
          // if only accesstoken is available
          if (__rt && !__atidk && mb_) {
            return jwt.verify(__rt, secretkey, (err, res) => {
              if (err) {
                remove_cookie(response)
                return { username: "false", cart_value: 0 };
              }
              if (res) {
                const { _id_ } = res;
                console.log(_id_);
                return Mobileuser.findById({ _id: _id_ }).then((userfound) => {
                  const { mb_ } = request.cookies;
                  if (userfound) {
                    const {
                      username,
                      cart_value,
                      refreshToken,
                      _id,
                    } = userfound._doc;
                    if (refreshToken.includes(__rt)) {
                      return createToken(_id, secretkey, "1h").then(
                        (result) => {
                          response.cookie("__atidk", result, {
                            httpOnly: true,
                            sameSite: "lax",
                            maxAge: 3600000,
                            secure:true
                          });
                          return { username: username, cart_value: cart_value };
                        }
                      );
                    } else {
                      return { username: "false", cart_value: 0 };
                    }
                  } else {
                    response.clearCookie("mb_");
                    return { username: "false", cart_value: 0 };
                  }
                });
              }
            });
          } else {
            return { username: "false", cart_value: 0 };
          }
        } catch (err) {
          throw new Error(err);
        }
      },
      //get googleusers
      getgoogleuser: () => {
        const { __rt, __atidk, mb_ } = request.cookies || null;
        try {
          if (__rt && __atidk && mb_) {
            return jwt.verify(__rt, secretkey, (err, verified_rt) => {
              if (err) {
                remove_cookie(response)
                return { username: "false", cart_value: 0 };
              } else if (!verified_rt) {
                return { username: "false", cart_value: 0 };
              } else {
                const { _id_ } = verified_rt;
                return Googleuser.findById({ _id: _id_ }).then((_rt_user) => {
                  if (_rt_user) {
                    const {
                      username,
                      cart_value,
                      refreshToken,
                      _id,
                    } = _rt_user._doc;
                    if (refreshToken.includes(__rt)) {
                      return jwt.verify(
                        __atidk,
                        secretkey,
                        (err, verified_at) => {
                          if (err) {
                            return createToken(_id, secretkey, "1h").then(
                              (newtoken) => {
                                console.log(username);
                                response.cookie("__atidk", newtoken, {
                                  httpOnly: true,
                                  sameSite: "lax",
                                });
                                return {
                                  username: username,
                                  cart_value: cart_value,
                                };
                              }
                            );
                          } else if (!verified_at) {
                            return { username: "false", cart_value: 0 };
                          } else
                            return {
                              username: username,
                              cart_value: cart_value,
                            };
                        }
                      );
                    }
                  } else {
                    remove_cookie(response)
                    return { username: "false", cart_value: 0 };
                  }
                });
              }
            });
          } else if (!__atidk && __rt && mb_) {
            return jwt.verify(__rt, secretkey, (err, res) => {
              if (err) {
                remove_cookie(response)
                return { username: "false", cart_value: 0 };
              }
              if (res) {
                const { _id_ } = res;
                return Googleuser.findById({ _id: _id_ }).then((userfound) => {
                  if (userfound) {
                    const {
                      username,
                      cart_value,
                      refreshToken,
                      _id,
                    } = userfound._doc;
                    if (refreshToken.includes(__rt)) {
                      return createToken(_id, secretkey, "1h").then(
                        (result) => {
                          response.cookie("__atidk", result, {
                            httpOnly: true,
                            sameSite: "lax",
                            maxAge: 3600000,
                            secure:true
                          });
                          return { username: username, cart_value: cart_value };
                        }
                      );
                    } else {
                      console.log("invalid refreshtoken");
                      throw new Error("invalid refreshtoken");
                    }
                  } else {
                    return { username: "false", cart_value: 0 };
                  }
                });
              }
            });
          } else {
            return { username: "false", cart_value: 0 };
          }
        } catch (err) {
          return { username: "false", cart_value: 0 };
        }
      },
      // logout user
      logout_: async () => {
    
        async function deletecookies() {
          remove_cookie(response)
          if (request.cookies.G_AUTHUSER_H)
            await response.clearCookie("G_AUTHUSER_H");
          return "verified";
        }
        async function delete_rt_from_gg_datatbase(_id_, rt) {
          const payloaduser = await Googleuser.findByIdAndUpdate(
            { _id: _id_ },
            { $pull: { refreshToken: rt } }
          );
          return payloaduser;
        }
        async function delete_rt_from_mb_datatbase(_id_, rt) {
          const payloaduser = await Mobileuser.findByIdAndUpdate(
            { _id: _id_ },
            { $pull: { refreshToken: rt } }
          );
          return payloaduser;
        }
        const { __rt, __atidk, mb_ } = request.cookies;
        if (__rt && __atidk && mb_) {
          return jwt.verify(__rt, secretkey, async (err, payload) => {
            if (err) return err.message;
            else if (payload) {
              const { _id_ } = payload;
              if (mb_ === "true") {
                return delete_rt_from_mb_datatbase(_id_, __rt).then(() => {
                  return deletecookies().then((res) => {
                    return res + "_mb_auth";
                  });
                });
              } else if (mb_ === "false")
                return delete_rt_from_gg_datatbase(_id_, __rt).then(() => {
                  return deletecookies().then((res) => {
                    return res + "_g_auth";
                  });
                });
            } else {
              remove_cookie(response)
              return "null";
            }
          });
        } else {
         remove_cookie(response)
          return "null";
        }
      },
      // add to cart
      addtocarter: async ({ cn__value }) => {
        const findgoogleuser = (_id_) => {
          return new Promise(async (resolve, reject) => {
            const googleuser = await Googleuser.findById({ _id: _id_ });
            if (googleuser) {
              resolve(googleuser);
            } else {
              reject(null);
            }
          });
        };
        const findmobileuser = (_id_) => {
          return new Promise(async (resolve, reject) => {
            const mobileuser = await Mobileuser.findById({ _id: _id_ });
            if (mobileuser) {
              resolve(mobileuser);
            } else {
              reject(null);
            }
          });
        };
        try {
          const { mb_, __rt } = request.cookies;
          if (mb_ && __rt) {
            return jwt.verify(__rt, secretkey, async (err, payload) => {
              if (err) {
               remove_cookie(response)
              } else if (payload) {
                const { _id_ } = payload;
                if (mb_ === "true") {
                  return findmobileuser(_id_).then(async (user_payload) => {
                    const { refreshToken } = user_payload;
                    if (refreshToken.includes(__rt)) {
                      user_payload.cart_value = cn__value;
                      await user_payload.save();
                      return { cn_value: user_payload.cart_value, uV_: "ok" };
                    }
                  });
                } else if (mb_ === "false") {
                  return findgoogleuser(_id_).then(async (user_payload) => {
                    const { refreshToken } = user_payload;
                    if (refreshToken.includes(__rt)) {
                      user_payload.cart_value = cn__value;
                      await user_payload.save();
                      return { cn_value: user_payload.cart_value, uV_: "ok" };
                    }
                  });
                }
              }
            });
          } else {
           remove_cookie(response)
            return { cn_value: 0, uV_: "null" };
          }
        } catch (err) {
       remove_cookie(response)
          return { cn_value: 0, uV_: "null" };
        }
      },
      // rendersignin Or not
      rendersigninOrnot: () => {
        const { mb_, __rt } = request.cookies;
        if (mb_ && __rt) {
          return jwt.verify(__rt, secretkey, (err, payload) => {
            if (err) {
              remove_cookie(response)
              return "true";
            } else if (!payload) {
              return "true";
            } else {
              return "false";
            }
          });
        } else {
          remove_cookie(response)
          return "true";
        }
      },
      mb__verification: () => {
        const { mb_ } = request.cookies;
        if (!mb_) {
       remove_cookie(response)
          return "unverified_mb";
        } else if (mb_) {
        remove_cookie(response)
          return "unverified_mb";
        }
      },
    },
  }))
);

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
function remove_cookie(response){
            response.clearCookie("mb_");
            response.clearCookie("__rt");
            response.clearCookie("__atidk");
}
if(process.env.NODE_ENV==='production')
{
  server.use(express.static('front/build'))
  server.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'front','build','index.html'))
  })
}
server.listen(port, () => {
  console.log("connected to the server at port %d", port);
});
