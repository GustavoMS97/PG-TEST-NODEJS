const express = require('express');

const { Client } = require('../models');

const router = express.Router();

/**
 * this request is used to update the client's data.
 */
router.put('/:id(\\d+)/', async (req, res) => {
  try {
    //Checks if the id was sent in the request parameters.
    if (!req.params.id) {
      return res
        .status(400)
        .send({ message: 'Client id missing in the request parameters.' });
    }
    //Retrieves the name, cep and cpf from the body of the request.
    const { name, cep, cpf } = req.body;
    let updateData = {};
    //checks if name was in the request body.
    if (name) {
      //Checks the type of name.
      if (typeof name === 'string') {
        //If it is a string, puts it in the updateData object.
        updateData['name'] = name;
      } else {
        //If it isn't, returns an error.
        return res.status(400).send({ message: 'Name malformatted.' });
      }
    }
    //Checks if the CEP was sent in the request body
    if (cep) {
      //Checks if cep is a string, a valid number and has the correct length.
      if (typeof cep === 'string' && !isNaN(cep) && cep.length === 8) {
        //If everything is ok, puts it inside updateData.
        updateData['CEP'] = cep;
      } else {
        //If it isn't, returns an error.
        return res.status(400).send({ message: 'CEP malformatted.' });
      }
    }
    //Checks if the CPF was sent in the request body
    if (cpf) {
      //Checks if cpf is a string, a valid number and has the correct length.
      if (typeof cpf === 'string' && !isNaN(cpf) && cpf.length === 11) {
        //If everything is ok, puts it inside updateData.
        updateData['CPF'] = cpf;
      } else {
        //If it isn't, returns an error.
        return res.status(400).send({ message: 'CPF malformatted.' });
      }
    }
    //Tries to update the client data in the database.
    const responseFromDatabase = await Client.update(updateData, {
      where: { _id: req.params.id },
    });
    //Checks if the response, that is an array, has a number '1' in the first index,
    // indicating the number of rows affected.
    const wasUpdated = responseFromDatabase[0] === 1;
    let response = {};
    //Checks if something was updated.
    if (wasUpdated) {
      //If it was, searches for the new client data, from the id in the request.
      const client = await Client.findOne({ where: { _id: req.params.id } });
      //Deletes the cep, cpf and user_id related.
      delete client.dataValues.CEP;
      delete client.dataValues.CPF;
      delete client.dataValues.user_id;
      //Puts the client data in the response, along with the "updated_info" status.
      response = { ...client.dataValues, status: 'update_info' };
    } else {
      //If it wasn't, puts a message indicating a error in the request.
      const message =
        'Client not found or request data is the same as client data.';
      response['message'] = message;
    }
    //Returns a response to the user.
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    //In any error occurs while updating the client data, returns a message to the user.
    return res
      .status(500)
      .send({ message: 'An error ocurred while trying to update the user' });
  }
});

/**
 * This request is used to delete a client and it's child data (Address).
 */
router.delete('/:id(\\d+)/', async (req, res) => {
  try {
    //Checks if the id was sent in the request.
    if (!req.params.id) {
      //If it wasn't, returns an error.
      return res
        .status(400)
        .send({ message: 'Client id missing in the request parameters.' });
    }
    //Tries to find a client in the database.
    const client = await Client.findOne({ where: { _id: req.params.id } });
    //Checks if there is any data in the response.
    if (client && client.dataValues) {
      //Tries to destroy the client data and it's child.
      const response = await Client.destroy({ where: { _id: req.params.id } });
      if (response && response > 0) {
        //Removes uneccessary data from the client object to return to the user.
        delete client.dataValues.CEP;
        delete client.dataValues.CPF;
        delete client.dataValues.user_id;
        //Returns a 200 status, indicating a successful delete request.
        return res
          .status(200)
          .send({ ...client.dataValues, status: 'deleted' });
      } else {
        //If something went wrong deleting the client, returns a message.
        return res.status(500).send({
          message: 'Client not found, or an error occurred deleting it.',
        });
      }
    } else {
      //returns that the client was not found.
      return res.status(200).send({ message: 'Client not found' });
    }
  } catch (error) {
    console.log(error);
    //In any error occurs while deleting the client data, returns a message to the user.
    return res
      .status(500)
      .send({ message: 'An error ocurred while trying to delete the client' });
  }
});

module.exports = (app) => app.use('/api/v.01/clients', router);
