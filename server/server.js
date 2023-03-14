const express = require('express');
const PORT = 3000;
const app = express();

const userController = require('./controllers/userController.js');
const infoController = require('./controllers/infoController.js');

//utility functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.post('/api/verifyuser', userController.verifyUser, (req, res)=>{
    res.status(200).json(res.locals.verified);
});
app.post('/api/createuser', userController.createUser, (req, res)=>{
    res.status(200).json(res.locals.results);
});

//routes for creating logs and getting correlation
app.post('/api/createLogs', infoController.createLogs, (req, res) => {
  res.status(200).send('logs created')
})
app.get('/api/correlations/:username', infoController.getUserId, infoController.getCorrelationData, (req, res) => {
  res.status(200).send(res.locals.correlations)
})

//404 handler
app.use('*', (req,res) => {
    res.status(404).send('Not Found');
});
//global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: err });
});

app.listen(PORT, ()=>{ console.log(`Listening on port ${PORT}...`); });

module.exports = app;
