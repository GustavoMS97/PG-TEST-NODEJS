const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
  // Checks if there is any file.
  if (!req.file) {
    return res.status(400).send({ error: 'Bad request, file expected' });
  }
  //Checks if the file type is valid.
  if (req.file.mimetype !== 'text/csv') {
    return res.status(400).send({ error: 'Unsupported file type.' });
  }
  //Builds regex
  const regex = /([A-Z a-z -])+_([A-Z a-z 0-9])+.csv/g;
  //Texts regex with file original name, different from the name which it was saved as.
  const result = regex.exec(req.file.originalname);
  //Checks if there is any results with the regex test
  if (!result) {
    return res.status(400).send({ error: 'File name is not valid.' });
  }
  //Checks if the file is formatted correctly.
  if (!validateFileHeaders(req.file.filename)) {
    return res.status(400).send({ error: 'File unformatted.' });
  }
  //Middleware check is fine, continues to the API's.
  return next();
};

/**
 * This method is checking if the file headers are the ones expected by the application.
 * @param {*} fileName string containing the file name.
 */
const validateFileHeaders = (fileName) => {
  try {
    //Reads the file contents
    var contents = fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'tmp', fileName),
      'utf8',
    );
    let newContents = contents;
    //Checks if the file ends with ';'
    if (contents.charAt(contents.length - 1) === ';') {
      //If it does, removes the last ';'.
      newContents = contents.substring(0, contents.length - 1);
    }
    //Removes every type of linebreak, and splits the string within the ';' char/separator.
    newContentsArray = newContents.split(';');
    //Creates a regex.
    const regex = /(\r\n|\n|\r)/g;
    //Returns the result of the validation that checks the expected headers.
    return (
      newContentsArray[0].toLowerCase() === 'nome' &&
      newContentsArray[1].toLowerCase() === 'cep' &&
      newContentsArray[2].toLowerCase() === 'cpf' &&
      regex.exec(newContentsArray[3].toLowerCase()) !== ([] || undefined)
    );
  } catch (error) {
    //If this method catches an error, returns false.
    console.log(error);
    return false;
  }
};
