const express = require('express');
const knex = require('../../../database/knex');
const router = express.Router();
//const getClockStatus = require("../../../utils/functions/getClockStatus.js")

// Delete punch with punchID
router.post('/deleteSession', async (req, res, next) => {
  try {
    let punchID = req.body.data.punchID;
    await knex('sessions').where('id', '=', punchID).delete()
    .then(
      res.status(201).json({
        status: true,
      }));
  } catch (err) {
    next(err);
  }
});

router.post('/newSession', async (req, res, next) => {
  try {
    let session = ({
      userID,
      inTime,
      outTime
    } = req.body);

    let payRate = await knex('users')
      .where({
        id: session.userID,
      })
      .limit(1)
      .select('payrate');

    if (typeof payRate[0] == 'undefined') res.status(404).json({});
    payRate = payRate[0].payrate;
    console.log(payRate);

    await knex
      .insert({
        userid: session.userID,
        intime: session.inTime,
        outtime: session.outTime,
        payrate: payRate,
      })
      .into('sessions')
      .then(
        res.status(201).json({
          status: true,
        }),
      );
  } catch (err) {
    next(err);
  }
});

router.post('/editSession', async (req, res, next) => {
  try {
    let punch = ({
      id,
      userid,
      intime,
      outtime,
      payrate
    } = req.body);

    await knex('sessions')
      .where({
        id: punch.id,
      })
      .update({
        intime: punch.intime,
        outtime: punch.outtime,
        payrate: punch.payrate,
      })
      .then(
        // response logic
        res.status(201).json({
          status: true,
        }),
      );
  } catch (err) {
    next(err);
  }
});

router.get('/getUserSessions', async (req, res, next) => {
  try {
    console.log(req.query);
    const userID = req.query.userID;
    const payPeriodBegin = req.query.payPeriodBegin;
    const payPeriodEnd = req.query.payPeriodEnd;
    let sessions = await knex.schema.raw(
      "SELECT id, userid, intime, outtime, createdat, payrate, \
                                            trunc(extract(epoch from(outtime - intime))) as secondsworked \
                                            FROM SESSIONS where userid = ? AND intime > ? AND intime < ?",
      [userID, payPeriodBegin, payPeriodEnd]
    );
    res.json(sessions.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;