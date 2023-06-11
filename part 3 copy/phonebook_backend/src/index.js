import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import Person from './models/person.js';

dotenv.config();
const app = express();
mongoose.set('strictQuery', true);

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('req_body', function(req, res) {
  if (req.method === 'POST'){
    return JSON.stringify(req.body);
  }
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req_body'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
  .findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person
  .countDocuments()
  .then(count => {
    response.send(`Phonebook has info for ${count} people<br>${new Date()}`)
  })
  .catch(error => {
    console.log(error)
    response.status(404).end()
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
  .findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {next(error)})
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number,
  }

  Person
  .findByIdAndUpdate(request.params.id, person, { new: true })
  .then(updatedContact => {
      response.json(updatedContact.toJSON())
    })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  console.log(request.body)
  console.log(request.body.number)
  console.log(request.body.name)

  if (!name || !number) {
    return response.status(400).json({ error: 'Name and number are required' });
  }

  
  const person = new Person({
    name,
    number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {console.log(error); next(error)})
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})