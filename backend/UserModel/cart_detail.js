const mongoose =require('mongoose')
const Mobile_cart_detail_Schema=new mongoose.Schema({
detail:[{
    cart_value:Number,
    created_at:Date
}],
mobile_user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Mobileuser"
}
})
module.exports.Mobile_cart_detail=mongoose.model("Cart_detail",Mobile_cart_detail_Schema)
