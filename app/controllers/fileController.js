const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');

const { User, Client, Address } = require('../models');
const multerConfig = require('../../config/multer');
const fileMiddleware = require('../middlewares/fileMiddleware');

const router = express.Router();

router.post(
  '/',
  multer(multerConfig).single('file'),
  fileMiddleware,
  async (req, res) => {
    const date_sent = new Date();
    const alreadyAdded = false;

    const id = req.file.originalname.split('.csv')[0].split('_')[1];

    let user = await User.findByPk(id);
    if (user) {
      alreadyAdded = true;
    } else {
      user = await persistUserData(req.file.originalname, date_sent);
    }

    const rs = fs.createReadStream(req.file.path);
    rs.pipe(csv({ separator: ';' }))
      .on('data', async ({ Nome, CEP, CPF }) => {
        const client = await Client.create({
          name: Nome,
          CEP,
          CPF,
          date_sent,
          user_id: user._id,
        });
        const { bairro, logradouro, localidade } = await axios.get(
          `https://viacep.com.br/ws/${CEP}/json/`,
        );
        //Chamada da api
        await Address.create({
          client_id: client._id,
          district: bairro,
          street: logradouro,
          state: localidade,
        });
      })
      .on('end', async () => {
        fs.unlinkSync(req.file.path);
      })
      .on('close', () => {
        console.log('closed');
      });

    let response = { ...user, status: 'upload_complete' };

    if (alreadyAdded) {
      response = { ...response, message: 'User id repeated' };
    }

    return res.status(201).send(response);
  },
);

const persistUserData = async (fileOriginalName, date_sent) => {
  const name = fileOriginalName.split('.csv')[0].split('_')[0];
  const id = fileOriginalName.split('.csv')[0].split('_')[1];
  const newUser = User.create({
    _id: id,
    name,
    file_name: fileOriginalName,
    date_sent,
  });
  return newUser;
};

module.exports = (app) => app.use('/api/v.01/files', router);
