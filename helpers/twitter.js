const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const { TwitterProfile } = require('../models');
const jwt = require('jsonwebtoken')
const request = require('request');

passport.use(new TwitterTokenStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
  },
  (token, tokenSecret, profile, done)=>{
    TwitterProfile.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
      return done(err, user);
    });
  })
);

const requestTwitterToken = (req, res) => {
  request.post({
    url: 'https://api.twitter.com/oauth/request_token',
    oauth: {
      oauth_callback: "http://localhost:3000",
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET
    }
  },(err, r, body)=>{
      if (err) {
        return res.send(500,{message:err.message});
      }
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
  });
}
const handleTwitterVerification = (req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;
      next();
    });
  }
const handleTwitterPassport = passport.authenticate('twitter-token',{session:false})
const sendTwitterProfile = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('User Not Authenticated');
  }
  const token = jwt.sign({twitter: req.user._id}, process.env.SECRET);
  return res.status(200).send({...req.user._doc,token});
}

const getUser = (req,res,next)=>(
  TwitterProfile.findOne({_id:req.body.twitterProfile})
  .then(user=>{
    req.user=user
    next();
  }).catch(()=>{
    next();
  })
)

const ensureAndDecodeUser = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    if(decoded && decoded.hasOwnProperty('twitter')){
      req.body.twitterProfile = decoded.twitter
      next();
    } else {
      res.status(401).json({message: 'Unauthorized'})
    }
  } catch(e){
    res.status(401).json({message: 'Unauthorized'})
  }
}
const decodeUser = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    if(decoded && decoded.hasOwnProperty('twitter')){
      req.body.twitterProfile = decoded.twitter
    }
    next();
  } catch(e){
    next();
  }
}

module.exports = {
  requestTwitterToken,
  handleTwitterPassport,
  handleTwitterVerification,
  sendTwitterProfile,
  getUser,

  ensureAndDecodeUser,
  decodeUser
}
