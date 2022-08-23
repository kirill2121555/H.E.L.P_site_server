const {Schema, model}=require('mongoose');

const MarkSchema=new Schema({
    pointHelpId:{type:Schema.Types.ObjectId, ref:'pointHelp'},
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    mark:{
        type:String,
        enam:['like','dislike','0'],
        default:'0'
    }
})

module.exports=model('Mark',MarkSchema);