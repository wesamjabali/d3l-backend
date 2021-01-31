// required modules
const express = require("express");
const knex = require("../../../database/knex");
const router = express.Router();

router.get("/getSessions", async (req, res, next) => {
  try {
    const payPeriodBegin = req.query.payPeriodBegin
    const payPeriodEnd = req.query.payPeriodEnd
    const currentUser = req.user;
    let sessions = await knex.schema.raw(
      "SELECT id, userid, intime, outtime, createdat, payrate, \
                                            trunc(extract(epoch from(outtime - intime))) as secondsworked \
                                            FROM SESSIONS where userid = ? AND intime > ? AND intime < ?",
      [currentUser.userID, payPeriodBegin, payPeriodEnd]
    );
    res.json(sessions.rows);
  } catch (err) {
    console.log(err);
  }
});

// get status of punch
router.get("/status", async (req, res, next) => {
  try {
    const currentUser = req.user;
    let status = await getClockStatus(currentUser.userID);
    res.send(status);
  } catch (err) {
    next(err);
  }
});

//get last punch for pay period
router.get("/lastSession", async (req, res, next) => {
  try {
    let lastPunch = await knex('sessions')
      .orderBy('intime', 'desc')
      .where('userid', '=', req.user.userID)
      .first()
      .select();
      if(typeof lastPunch == "undefined") lastPunch = "undefined"
      res.send(lastPunch)
  } catch (err) {
    next(err)
  }
  }),
  // punch in/out
  router.post("/punch", async (req, res, next) => {
    try {
      // grab current user
      const currentUser = req.user;
      // initialize body params
      userID = currentUser.userID;
      let lastPunch = await getClockStatus(currentUser.userID);
      if (lastPunch != "in") {
        await knex("sessions")
          .insert({
            userid: currentUser.userID,
            payrate: currentUser.payRate,
          })
          .then(
            // response logic
            res.status(201).json({
              status: true,
            })
          );
      } else {
        await knex("sessions")
          .where({
            userid: currentUser.userID,
            outtime: null,
          })
          .update({
            outtime: new Date(), //change so dates are created at client, for timezone.
          })
          .then(
            // response logic
            res.status(201).json({
              status: true,
            })
          );
      }
    } catch (err) {
      next(err);
    }
  }),
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
      const currentUser = req.user;
      let session = ({
        inTime,
        outTime
      } = req.body);
      session.userID = currentUser.userID;
  
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
      let session = ({
        inTime,
        outTime,
        sessionID
      } = req.body);
  
      await knex('sessions')
      .where({ id: session.sessionID })
        .update({
          intime: session.inTime,
          outtime: session.outTime,
        })
        .then(
          res.status(201).json({
            status: true,
          }),
        );
    } catch (err) {
      next(err);
    }
  });

module.exports = router;