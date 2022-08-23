const {Schema, model}=require('mongoose');

const AssistantSchema=new Schema({
    name:{type:String,required: true},
    email:{type:String,required: true,unique:true},
    phone:{type:String,required: true},
    city:{type:String,required: true},
    description:{type:String},
    title:{type:String},
    picture:{type:String},
    datecreate:{type:Date,default: Date.now},
    alltext:{type:String,lowercase: true},
    autorid:{type:Schema.Types.ObjectId, ref:'User'},

})

module.exports=model('Assistant',AssistantSchema);