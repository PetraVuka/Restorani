const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

// Middleware za parsiranje JSON podataka
app.use(express.json());

// Povezivanje na MongoDB bazu podataka
mongoose.connect('mongodb://localhost:27017/restorani')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection to MongoDB failed:', err));

// Definisanje modela za restoran
const restoranSchema = new mongoose.Schema({
  naziv: String,
  adresa: String,
  telefon: String,
  vrsta: String
});

const Restoran = mongoose.model('Restoran', restoranSchema);

// Definisanje RESTful API ruta
app.get('/restorani', async (req, res) => {
  const restorani = await Restoran.find();
  res.json(restorani);
});

app.post('/restorani', async (req, res) => {
  const restoran = new Restoran(req.body);
  await restoran.save();
  res.status(201).json(restoran);
});

app.put('/restorani/:id', async (req, res) => {
  const restoran = await Restoran.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(restoran);
});

app.delete('/restorani/:id', async (req, res) => {
  await Restoran.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
