var express = require('express');
var {ensureAndDecodeUser,getUser,requestTwitterToken,handleTwitterVerification,handleTwitterPassport,sendTwitterProfile} = require('../helpers/twitter');
var router = express.Router({mergeParams:true});

router.route('/request_token')
  .post(requestTwitterToken);

router.route('/verification')
  .post(
    handleTwitterVerification,
    handleTwitterPassport,
    sendTwitterProfile);

router.route('/login')
  .post(
    ensureAndDecodeUser,
    getUser,
    sendTwitterProfile
  )
module.exports = router;
