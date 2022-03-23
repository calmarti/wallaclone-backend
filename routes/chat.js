"use strict";
const express = require("express");
const {Chat, Message} = require("../models/Chat");

const router = express.Router();

router.post("/create", async function (req, res, next) {
  try {
    const fields = { ...req.body};
    const newChat = await Chat.create(fields);
    res.json(newChat);
  } catch (err) {
    next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const chatinfo = await Chat.find({}, function (err, chats) {
      res.send(chats);
  });
    //res.json(newChat);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const MSGchatId = req.params.id;
    const chatinfo = await Message.find({chatId: MSGchatId}, function (err, chats) {
      res.send(chats);
  });
  } catch (err) {
    next(err);
  }
});

router.delete('/', async function (req, res, next) {
  try {
    await Chat.deleteMany({}, res.send("borrado"))
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
   const fields = { ...req.body};
    const newMSG = await Message.create(fields);
    console.log(newMSG)
    res.send(newMSG);
  } catch (err) {
    next(err);
  }
});


module.exports = router;


