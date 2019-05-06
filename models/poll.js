const mongoose = require("mongoose");

const nomination = new mongoose.Schema({
  title:{
    type:String,
    required:true,
    minlength:2,
    maxlength:25
  },
  index:{
    type:Number,
    required:true
  },
  voters:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"TwitterProfile"
  }]
})

const poll = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength:5,
    maxlength:75
  },
  twitterProfile: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"TwitterProfile"
  },
  created_at: {
    type:Date,
    required: true,
    default: Date.now
  },
  finish_at: {
    type: Date,
    required:true,
    default:()=>{
      const now = Date.now();
      return new Date(now + 24*60*60*1000 - now%(24*60*60*1000))
    },
    validate:[
      {validator:d=>new Date(d)-new Date()>1000*60*60,msg:'The finish date of a poll should be atleast an hour from now',kind:'mindate'},
      {validator:d=>new Date(d)-new Date()<1000*60*60*24*366,msg:'The finish date of a poll should be atmost 365 days from now',kind:'maxdate'},
    ]
  },
  nominations:{
    type:[nomination],
    validate:[
      {validator:v=>v.length>=2,msg:'Must have at least 2 unique nominations',kind:'minlength'},
      {validator:v=>v.length<=10,msg:'Must have at most 10 nominations',kind:'maxlength'},
      {validator:noms=>{
        return !noms.map((n,i,arr)=>arr.findIndex(n2=>n.title===n2.title)===i).includes(false)
      },msg:'No duplicate nominations allowed',kind:'duplicate'}
    ]
  }
});

poll.index({ twitterProfile: 1, title: 1}, { unique: true });
const Poll = mongoose.model("Poll",poll)


module.exports = Poll;
