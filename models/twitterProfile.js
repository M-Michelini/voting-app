const mongoose = require('mongoose');

const twitterProfile = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  phoneVerified:{
    type:Boolean,
    required:true,
    default:false
  },
  image:{
    type:String,
    required:true
  },
  provider:{
    type:{
      id: String,
      token: String,
      secret: String
    },
    select:false
  }
});

twitterProfile.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
  const that = this;
  return this.findOne({
    'provider.id': profile.id
  }, function(err, user) {
    if (!user) {
      var newUser = new that({
          username: profile.username,
          image: profile._json.profile_image_url,
          phoneVerified: !profile.needs_phone_verification,
          provider:{
            id:profile.id,
            token: token,
            tokenSecret: tokenSecret
          }
      });
      newUser.save(function(error, savedUser) {
        return cb(error, savedUser);
      });
    } else {
      return cb(err, user);
    }
  });
};

const TwitterProfile = mongoose.model("TwitterProfile",twitterProfile);

module.exports = TwitterProfile;
