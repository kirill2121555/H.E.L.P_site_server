const {Schema, model}=require('mongoose');

const NeedHelpSchema=new Schema({
    name:{type:String,required: true},
    secondName:{type:String,required: true,unique:true},
    phone:{type:String,required: true},
    city:{type:String,required: true},
    listThings:{type:String},
    description:{type:String},
    datecreate:{type:Date,default: Date.now},
    alltext:{type:String,lowercase: true},
})

module.exports=model('NeedHelp',NeedHelpSchema);