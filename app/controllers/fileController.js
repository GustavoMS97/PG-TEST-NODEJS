const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const Op = require('sequelize').Op;

const { User, Client, Address } = require('../models');
const multerConfig = require('../../config/multer');
const fileMiddleware = require('../middlewares/fileMiddleware');

const router = express.Router();

/**
 * This request is used to receive user files,
 *  containing it's clients data and addresses.
 */
router.post(
  '/',
  multer(multerConfig).single('file'),
  fileMiddleware,
  async (req, res) => {
    try {
      //Creates the date used to persist the objects, for time reference.
      const date_sent = new Date();
      //Creates the indicator that indicates if its going to be a new user or not.
      let alreadyAdded = false;
      //Gets the user desired id from the file name.
      const _id = req.file.originalname.split('.csv')[0].split('_')[1];
      //Searches for a user in the database.
      let user = await User.findOne({ where: { _id } });
      //Checks if the user exists.
      if (user && user.dataValues) {
        //If it does, indicates so in the flag.
        alreadyAdded = true;
      } else {
        //If it was not created, creates a new user.
        user = await persistUserData(req.file.originalname, date_sent);
        //Checks if the creation was ok.
        if (!user) {
          //If it was not, indicates in the request response.
          return res
            .status(500)
            .send({ message: 'Internal error creating user' });
        }
      }
      //Starts reading the file.
      const rs = fs.createReadStream(req.file.path);
      rs.pipe(csv({ separator: ';' }))
        .on('data', async ({ Nome, CEP, CPF }) => {
          //To each row, extracts the Nome, CEP and CPF and creates the client.
          const client = await persistClientData(
            Nome,
            CEP,
            CPF,
            date_sent,
            user.dataValues._id,
          );
          const url = `https://viacep.com.br/ws/${CEP}/json/`;
          //Uses axios to request the user address data from it's CEP.
          const response = await axios.get(url);
          //Checks if there is any data.
          if (response && response.data) {
            //Extracts the desired variables from the response.
            const { bairro, logradouro, localidade } = response.data;
            //Persists the address.
            await persistAddressData(
              client.dataValues._id,
              bairro,
              logradouro,
              localidade,
            );
          }
        })
        .on('end', async () => {
          //At the end of the file, deletes it from the tmo folder.
          fs.unlinkSync(req.file.path);
        });
      //Creates a response variable, using the user data and adding a status.
      let response = { ...user.dataValues, status: 'upload_complete' };
      if (alreadyAdded) {
        //If the userId in the file name was repeated, indicates in the response.
        response = { ...response, message: 'User id repeated' };
      }
      //Returns the response created.
      return res.status(201).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Internal error' });
    }
  },
);

router.get('/:id', async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: 'User id missing inside request.' });
  }
  let response = {};
  const user = await User.findOne({
    where: { _id: req.params.id },
  });
  if (user && user.dataValues) {
    response = { ...user.dataValues };
    const clientsModelArray = await Client.findAll({
      where: { user_id: user.dataValues._id },
    });
    if (clientsModelArray) {
      const clientsArray = [];
      clientsModelArray.forEach((client) => {
        delete client.dataValues.user_id;
        clientsArray.push(client.dataValues);
      });
      for (let i = 0; i < clientsArray.length; i++) {
        const addressModel = await Address.findOne({
          where: { client_id: clientsArray[i]._id },
        });
        if (addressModel && addressModel.dataValues) {
          delete addressModel.dataValues.client_id;
          clientsArray[i]['address'] = addressModel.dataValues;
        }
      }
      response = { ...response, clients: clientsArray };
    }
  }
  return res.status(200).send(response);
});

/**
 * This method creates a "address" and returns it's data.
 * @param {*} client_id id of the client that the address belongs to.
 * @param {*} district address district
 * @param {*} street address street
 * @param {*} state address state.
 */
const persistAddressData = async (client_id, district, street, state) => {
  try {
    //Creates the address asynchronously.
    await Address.create({
      client_id,
      district,
      street,
      state,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * This method creates a "client" and returns it's data.
 * @param {*} name client name.
 * @param {*} CEP clients CEP
 * @param {*} CPF clients CPF.
 * @param {*} date_sent date of the request.
 * @param {*} user_id id of the user that the client belongs to.
 */
const persistClientData = async (name, CEP, CPF, date_sent, user_id) => {
  try {
    //Creates the client asynchronously.
    const client = await Client.create({
      name,
      CEP,
      CPF,
      date_sent,
      user_id,
    });
    //Returns the client data.
    return client;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * This methos creates a "user" and returns it's data.
 * @param {*} file_name file original name.
 * @param {*} date_sent date of the request.
 */
const persistUserData = async (file_name, date_sent) => {
  try {
    //Retrieves the user name from the file name.
    const name = file_name.split('.csv')[0].split('_')[0];
    //Retrieves the user id from the file name.
    const _id = file_name.split('.csv')[0].split('_')[1];
    //Creates the user asynchronously.
    const newUser = await User.create({
      _id,
      name,
      file_name,
      date_sent,
    });
    //Returns the user.
    return newUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = (app) => app.use('/api/v.01/files', router);
