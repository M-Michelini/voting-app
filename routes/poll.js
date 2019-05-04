const express = require('express');
const router = express.Router({mergeParams:true});

const {getPolls,getPoll,createPoll,upsertVote} = require('../helpers/poll');
const {decodeUser,ensureAndDecodeUser} = require('../helpers/twitter')

router.route('/')
  .get(
    decodeUser,
    getPolls
  )
  .post(
    ensureAndDecodeUser,
    createPoll
  );
router.route('/:_id')
  .get(getPoll)
router.route('/:_id/vote')
  .put(
    ensureAndDecodeUser,
    upsertVote
  )
module.exports = router;
