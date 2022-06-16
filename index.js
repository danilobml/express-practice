const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const pets = require("./helper");

app.get("/", (req, res, next) => {
  let html = `<h1>Adopt a pet! 🐕 🐈 🐇 🦄</h1><p>Browse through the links below to find your new furry friend:</p><ul>`;
  const keys = Object.keys(pets);
  keys.forEach((key) => {
    html += `<li><a href='/animals/${key}'>${key}</a></li>`;
  });
  html += `</ul><br><a href='/new'>Surrender your pet</a>`;
  res.send(html);
});

app.get("/animals/:pet_type", (req, res, next) => {
  const petsList = pets[req.params.pet_type];
  let html = `<h1>List of ${req.params.pet_type}</h1><ul>`;
  if (petsList) {
    petsList.forEach((pet, index) => {
      html += `<li><a href='/animals/${req.params.pet_type}/${index}'>${pet.name}</a></li>`;
    });
    html += `</ul>`;
    res.send(html);
  } else {
    res.send(`<h1>We don't have any of those!</h1>`);
  }
});

app.get("/animals/:pet_type/:pet_id", (req, res, next) => {
  const pet = pets[req.params.pet_type][req.params.pet_id];
  let html = `<h1>${pet.name}</h1><img src=${pet.url} alt=${pet.name}/><p>Description: ${pet.description}</p><ul><li>Breed: ${pet.breed}</li><li>Age: ${pet.age}</li></ul>`;
  res.send(html);
});

app.get("/new", (req, res, next) => {
  const keys = Object.keys(pets);
  let options = "";
  keys.forEach((key) => {
    options += `<option value="${key}">${key}</option>`;
  });
  const form = `
  <form method="POST" action="/new">
  <label for="type">Species: </label>
    <select name="type" id="type">
      ${options}
    </select></br>
    <label for="name">Name: </label>
    <input type="text" id="name" placeholder="Type the name" name="name" /></br>
    <label for="age">Age: </label>
    <input type="number" id="age" name="age" /></br>
    <label for="breed">Breed: </label>
    <input type="text" id="breed" name="breed" /></br>
    <label for="description">Description: </label>
    <input type="text" id="description" name="description" /></br>
    <label for="pic">Pic URL: </label>
    <input type="text" id="pic" name="url" /></br>
    <input type="submit"/>
  </form>`;

  res.send(form);
});

app.post("/new", (req, res) => {
  const newAnimal = {
    name: req.body.name,
    age: req.body.age,
    breed: req.body.breed,
    description: req.body.description,
    url: req.body.url,
  };
  pets[req.body.type].push(newAnimal);
  res.status(201).send(newAnimal);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
