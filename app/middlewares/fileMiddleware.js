module.exports = (req, res, next) => {
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
    return res.status(400).send({ error: 'File name is not valid' });
  }
  //Middleware check is fine, continues to the API's.
  return next();
};
