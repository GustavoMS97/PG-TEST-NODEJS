const express = require('express');

const { User, Client, Address } = require('../models');

const router = express.Router();

/**
 * This request is used to get the user data.
 */
router.get('/:id', async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: 'An error ocurred while fetching the user data.' });
  }
  //Checks if the id was sent in the request parameters.
  if (!req.params.id) {
    return res
      .status(400)
      .send({ message: 'User id missing in the request parameters.' });
  }
  let response = {};
  //Tries to find a user with the id from the request.
  const user = await User.findOne({
    where: { _id: req.params.id },
  });
  //Checks if there is anu user in the response from the database.
  if (user && user.dataValues) {
    //Puts the user data inside the response object.
    response = user.dataValues;
    //Tries to find clients with that userId.
    const clientsModelArray = await Client.findAll({
      where: { user_id: user.dataValues._id },
    });
    //Checks if the array has any objects.
    if (clientsModelArray) {
      const clientsArray = [];
      //Loops through the array
      clientsModelArray.forEach((client) => {
        //Deletes the user_id, just for better looking responses.
        delete client.dataValues.user_id;
        //Puts the client data inside the clients array.
        clientsArray.push(client.dataValues);
      });
      //Loops through the clients array
      for (let i = 0; i < clientsArray.length; i++) {
        //Tries to find an address with that client id.
        const addressModel = await Address.findOne({
          where: { client_id: clientsArray[i]._id },
        });
        //Checks if there is any address in the response.
        if (addressModel && addressModel.dataValues) {
          //Deletes the client_id, just for better looking responses.
          delete addressModel.dataValues.client_id;
          //Puts the address inside the client object
          clientsArray[i]['address'] = addressModel.dataValues;
        }
      }
      //Puts the array of clients inside the response object.
      response['clients'] = clientsArray;
    }
  }
  //Returns the user data.
  return res.status(200).send(response);
});

/**
 * This request is used to delete the user from the database, along with it's childs (Clients and addresses).
 */
router.delete('/:id', async (req, res) => {
  try {
      //Checks if the id is in the request parameters.
    if (!req.params.id) {
      return res
        .status(400)
        .send({ message: 'User id missing in the request parameters.' });
    }
    //Searches for the user in the database.
    const user = await User.findOne({ where: { _id: req.params.id } });
    //Checks if there is any user data.
    if (user && user.dataValues) {
        //Tries to destroy/delete the user and its childs from the database.
      const response = await User.destroy({ where: { _id: req.params.id } });
      //Checks the response from the delete operation.
      if (response && response > 0) {
          //If it was suceeded, returns the user data and the status "deleted".
        return res.status(200).send({ ...user.dataValues, status: 'deleted' });
      } else {
          //If it wasn't successful
        return res.status(500).send({
          message: 'User not found, or an error occurred deleting it.',
        });
      }
    } else {
        //If there isn't any user with the id provided, returns a message.
      return res.status(200).send({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    //If any errors occurs, returns a message to the user.
    return res
      .status(500)
      .send({ message: 'An error ocurred while trying to delete the user' });
  }
});

module.exports = (app) => app.use('/api/v.01/users', router);
