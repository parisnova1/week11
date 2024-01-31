// app.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;
const petsFilePath = 'pets.json';

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Helper function to read pet data from the file
async function readPetsData() {
  try {
    const data = await fs.readFile(petsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    return [];
  }
}

// Helper function to write pet data to the file
async function writePetsData(pets) {
  await fs.writeFile(petsFilePath, JSON.stringify(pets, null, 2), 'utf8');
}

// Route to retrieve a list of pets
app.get('/pets', async (req, res) => {
  const pets = await readPetsData();
  res.json(pets);
});

// Route to add a new pet
app.post('/pets', async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type are required for a new pet.' });
  }

  const newPet = { name, type };

  const pets = await readPetsData();
  pets.push(newPet);

  await writePetsData(pets);

  res.json(newPet);
});

// Route to edit a pet (Bonus)
app.put('/pets/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type are required for editing a pet.' });
  }

  const pets = await readPetsData();
  const index = pets.findIndex((pet) => pet.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Pet not found.' });
  }

  pets[index] = { id: parseInt(id), name, type };

  await writePetsData(pets);

  res.json(pets[index]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
