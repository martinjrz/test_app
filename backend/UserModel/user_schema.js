const mongoose =require('mongoose')
const MobileUserSchema=new mongoose.Schema({
username:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
phone_no:{
    type:String,
    required:true
},
cart_value:{
    type:Number,
    default:0
},
Cart_detail:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cart_detail"
}],
refreshToken:[{
    type:String
}]
})
module.exports.Mobileuser=mongoose.model("Mobileuser",MobileUserSchema)
