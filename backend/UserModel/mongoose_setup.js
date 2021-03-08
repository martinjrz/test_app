const mongoose=require('mongoose')

const url='mongodb+srv://naren:passwordz98@cluster0.rijsd.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
const db=mongoose.connection;
db.on('error',(err)=>{
    console.log(err)
})
db.once('open',()=>{
    console.log('connection is done with database')
})




module.exports={
    mongoose
}