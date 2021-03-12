const mongoose =require('mongoose')
const GoogleuserSchema=new mongoose.Schema({
username:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
cart_value:{
    type:Number,
    default:0
},
Cart_detail:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Google_cart_detail"
}],
refreshToken:[{
    type:String
}]
})

const Google_cart_detail_Schema=new mongoose.Schema({
detail:[{
    cart_value:Number,
    created_at:Date
}],
google_user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"googleuser"
}
})
module.exports.Google_cart_detail=mongoose.model("Google_cart_detail",Google_cart_detail_Schema)

module.exports.Googleuser=mongoose.model("Googleuser",GoogleuserSchema)
