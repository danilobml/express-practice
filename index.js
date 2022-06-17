const express = require("express");
const app = express();
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
  if (pet) {
    let html = `<h1>${pet.name}</h1><img src=${pet.url} alt=${pet.name}/><p>Description: ${pet.description}</p><ul><li>Breed: ${pet.breed}</li><li>Age: ${pet.age}</li></ul><form method="POST" action="/delete/${req.params.pet_type}/${req.params.pet_id}/?_method=DELETE"><input type="submit" name="_method" value="Adopt this animal!"></button></form><br><a href="/put/${req.params.pet_type}/${req.params.pet_id}">Edit this animal's data</a>`;
    res.send(html);
  } else {
    res.status(404).send("Not found.");
  }
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
    <input type="number" id="age" name="age" min="0" placeholder="Type or select the age" /></br>
    <label for="breed">Breed: </label>
    <input type="text" id="breed" name="breed" placeholder="Type the breed" /></br>
    <label for="description">Description: </label>
    <input type="text" id="description" name="description" placeholder="Describe the pet" /></br>
    <label for="pic">Pic URL: </label>
    <input type="text" id="pic" name="url" placeholder="Add an URL with a pic" /></br>
    <input type="submit"/>
  </form>`;

  res.send(form);
});

//Create new animal (put for adoption):
app.post("/new", (req, res) => {
  const newAnimal = {
    name: req.body.name,
    age: req.body.age,
    breed: req.body.breed,
    description: req.body.description,
    url: req.body.url,
  };
  pets[req.body.type].push(newAnimal);
  res.status(201).send(`<h1>${newAnimal.name} included!</h1><br><a href="/">Home</a>`);
});

//Delete animal (adopt):

app.delete("/delete/:pet_type/:pet_id", (req, res, next) => {
  const pet = pets[req.params.pet_type][req.params.pet_id];
  if (pet) {
    const index = pets[req.params.pet_type].indexOf(pet);
    pets[req.params.pet_type].splice(index, 1);
    res.status(204).redirect("/");
  } else {
    res.status(404).send("Not found.");
  }
});

//Edit animal:
app.get("/put/:pet_type/:pet_id", (req, res, next) => {
  const pet = pets[req.params.pet_type][req.params.pet_id];
  const form = `<h1>Edit the data from ${pet.name}:</h1>
  <form method="POST" action="/put/${req.params.pet_type}/${req.params.pet_id}/?_method=PUT" method="post"">
    <label for="name">Name: </label>
    <input type="text" id="name" placeholder=${pet.name} name="name" /></br>
    <label for="age">Age: </label>
    <input type="number" id="age" name="age" min="0" placeholder=${pet.age}/></br>
    <label for="breed">Breed: </label>
    <input type="text" id="breed" name="breed" placeholder=${pet.breed}/></br>
    <label for="description">Description: </label>
    <input type="text" id="description" name="description" placeholder=${pet.description}/></br>
    <label for="pic">Pic URL: </label>
    <input type="text" id="pic" name="url" placeholder=${pet.url}/></br>
    <input type="submit" name="_method"/>
  </form>`;
  res.send(form);
});

app.put("/put/:pet_type/:pet_id", (req, res, next) => {
  const pet = pets[req.params.pet_type][req.params.pet_id];
  if (pet) {
    pet.name = req.body.name || pet.name;
    pet.age = req.body.age || pet.age;
    pet.breed = req.body.breed || pet.breed;
    pet.description = req.body.description || pet.description;
    pet.url = req.body.url || pet.url;
    res.send(`<h1>Updated</h1><br><a href="/">Home</a>`);
  } else {
    res.status(404).send("Not found.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
