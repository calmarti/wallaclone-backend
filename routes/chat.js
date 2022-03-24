"use strict";
const express = require("express");
const {Chat, Message} = require("../models/Chat");

const router = express.Router();

// Crear chat
router.post("/create", async function (req, res, next) {
  try {
    const fields = { ...req.body};
    const newChat = await Chat.create(fields);
    res.json(newChat);
  } catch (err) {
    next(err);
  }
});

// Devuelve los usuarios que pertenecen a un chat
router.get("/info/:id", async function (req, res, next) {
  try {
    const MSGchatId = req.params.id;
    const chatinfo = await Chat.find({chatId: MSGchatId}, function (err, chats) {
      console.log("aqui los chats " + chats)
      if (chats[0] == undefined){console.log("mal")}else{console.log(chats[0].chatSeller); res.send([chats[0].chatSeller, chats[0].chatBuyer]);}
  });
  } catch (err) {
    next(err);
  }
});



// Devuelve los mensajes de un chat
router.get("/:id", async function (req, res, next) {
  console.log("aqui")
  try {
    const MSGchatId = req.params.id;
    const chatinfo = await Message.find({chatId: MSGchatId}, function (err, chats) {
      res.send(chats);
  });
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


//eliminar TODOS LOS CHATS
router.delete('/', async function (req, res, next) {
  try {
    await Chat.deleteMany({}, res.send("borrado"))
  } catch (err) {
    next(err);
  }
});

router.delete('/mensajes', async function (req, res, next) {
  try {
    await Message.deleteMany({}, res.send("borrado"))
  } catch (err) {
    next(err);
  }
});
// Crear MENSAJE
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


