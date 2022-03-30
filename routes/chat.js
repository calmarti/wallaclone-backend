"use strict";
const express = require("express");
const {Chat, Message} = require("../models/Chat");

const router = express.Router();


// Devuelve los chats a los que pertenecen a un usuario
router.get('/allchats/:user', async function (req, res, next) {
  
  const fields = req.params.user;

  let allmychats = [] 

  try {
    const chatseller = await Chat.find({chatSeller: fields}, function (err, chats) {
      allmychats.push(chats);
    });
    const chatbuyer = await Chat.find({chatBuyer: fields}, function (err, chats) {
      allmychats.push(chats);
    });
    res.send(allmychats)
  } catch (err) {
    next(err);
  }
})


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
      if (chats[0] == undefined){}else{ res.send([chats[0].chatSeller, chats[0].chatBuyer]);}
  });
  } catch (err) {
    next(err);
  }
});



// Devuelve los mensajes de un chat
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

//devuelve los chats a los que pertenece un usuario

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
    res.send(newMSG);
  } catch (err) {
    next(err);
  }
});


module.exports = router;


