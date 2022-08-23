const {Schema, model}=require('mongoose');

const pointHelpSchema=new Schema({
    name:{type:String,required: true},
    nameBoss:{type:String,required: true,unique:true},
    phone:{type:String,required: true},
    address:{type:String,required: true},
    city:{type:String,required: true},
    email:{type:String,required: true},
    region:{type:String,required: true},
    listThings:{type:String},
    description:{type:String},
    datecreate:{type:Date,default: Date.now},
    views:{type:Number,default:0},
    like:{type:Number,default:0},
    dislike:{type:Number,default:0},
    comment:[{type:Schema.Types.ObjectId, ref:'Comment'}],
    alltext:{type:String,lowercase: true}, 
})

module.exports=model('pointHelp',pointHelpSchema);