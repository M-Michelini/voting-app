const {Poll,TwitterProfile} = require('../models');
const ObjectId = require('mongoose').Types.ObjectId;
const {handleMongoErrors} = require('./error')

const getSortAggregate = (sort)=>{
  const [inType,inDir] = sort.split('-');
  const firstDir = inDir==='desc'?-1:1
  const first = ['voters','created_at','title','finish_at'].includes(inType)?inType:'created_at'
  const second = first==='title'?'voters':'title'
  return {
    [first]:firstDir,
    [second]:1
  }
}

exports.getPolls = async (req,res) => {
  const page = Number(req.query.page) || 0;
  const limit = Number(req.query.limit) || 18;
  const sort = req.query.sort || 'created_at';
  let filters = req.query.filters?req.query.filters.split(','):[]
  const match = {};
  if(req.body.twitterProfile&&filters.includes('users')) match.twitterProfile = new ObjectId(req.body.twitterProfile);
  if(filters.includes('active')){
    match.finish_at = {$gte:new Date()};
    filters = filters.filter(f=>f!=='complete')
  }
  if(filters.includes('complete')){
    match.finish_at = {$lt:new Date()};
    filters = filters.filter(f=>f!=='active')
  }
  const out = await Poll.aggregate([
    {
      $match:match
    },
    {
      $unwind: {path:"$nominations"}
    },
    {
      $group:{
        _id:'$_id',
        voters:{$sum:{$size:'$nominations.voters'}},
        title:{$first:'$title'},
        created_at:{$first:'$created_at'},
        twitterProfile:{$first:'$twitterProfile'},
        finish_at:{$first:'$finish_at'}
      },
    },{
    $facet:{
      data:[
        {
          $sort:getSortAggregate(sort)
        },{
          $skip:page*limit
        },{
          $limit:limit
        }
      ],
      totalCount: [
        { $count: 'count' }
      ]
    }}
  ]).exec();
  res.status(200).json({
    data:!out[0].totalCount[0]?[]:out[0].data.map(d=>({...d,title:d.title,complete:new Date(d.created_at)>=new Date(d.finish_at)})),
    sort,page,limit,filters,
    totalPages:!out[0].totalCount[0]?0:Math.ceil(out[0].totalCount[0].count/limit)
  });
}

exports.getPoll = (req,res) => {
  Poll.findById(req.params._id).lean()
  .then(poll=>{
    res.status(200).json({
      ...poll,
      nominations:poll.nominations.sort((a,b)=>a.voters.length>b.voters.length?-1:a.voters.length<b.voters.length?1:0),
      title:poll.title
    });
  })
  .catch(err=>{
    res.status(404).json({error:{message:'Poll not found!'}});
  })
}
const prepText = (val) =>{
  let out = val.trim().replace(/\s{1,}/,' ').toLowerCase();
  if(out.length<1) return '';
  return out.substring(0,1).toUpperCase() + out.substring(1)
}
exports.createPoll = (req,res) => {
  const nominations = req.body.nominations
    .map((title,index)=>{
      return {title:prepText(title),index}
    })
  Poll.create({
    ...req.body,
    nominations,
    title:prepText(req.body.title)
  }).then(poll=>{
    return res.status(202).json(poll);
  }).catch(e=>{
    if(e.hasOwnProperty('name')&&e.name==='ValidationError'){
      return res.status(404).json({errors:handleMongoErrors(e.errors)})
    }
    if(e.code===11000) return res.status(404).json({errors:[{path:'title',message:'You already have a poll with this title'}]})
    res.status(404).json({message:'Failed'})
  })
}

const pullVote = (req) => Poll.updateOne(
  {_id:req.params._id},
  {
    '$pull':{'nominations.$[].voters':req.body.twitterProfile}
  }
)
const addVote = (req) => Poll.updateOne(
  {_id:req.params._id,'nominations.index':req.body.nominationIndex},
  {
    '$addToSet':{'nominations.$.voters':req.body.twitterProfile}
  }
)

exports.upsertVote = async (req,res,next) => {
  const found = await Poll.findOne({_id:req.params._id});
  const voter = await TwitterProfile.findOne({_id:req.body.twitterProfile})
  if(!found  || !voter || new Date()>=new Date(found.finish_at)) return res.status(404).json({message:"Invalid poll."});
  await pullVote(req);
  if(req.body.pull) return res.status(200).json({success:'Your vote has been removed.'})
  const poll = await addVote(req);
  if(poll.nModified){
    return res.status(200).json({success:'Your vote has been cast.'})
  }else{
    return res.status(404).json({message:"Invalid nomination index."});
  }
}
