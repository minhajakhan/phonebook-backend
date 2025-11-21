const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
// app.use(morgan('tiny'))

let phonebookEntries = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }
  
app.use(express.json())
// app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    response.json(phonebookEntries)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const phoneBookEntry = phonebookEntries.find(entry => entry.id === id)

    if (phoneBookEntry) {
        response.json(phoneBookEntry)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebookEntries = phonebookEntries.filter(entry => entry.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if ( !body.name || !body.number ) {
        return response.status(404).json({
            error: 'name or number missing'
        })
    }

    if (phonebookEntries.find(entry => entry.name === body.name)) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const newId = Math.floor(Math.random() * 100000000)

    const newPhoneboookEntry = {
        id: newId,
        name: body.name,
        number: body.number
    }

    phonebookEntries.concat(newPhoneboookEntry)
    
    response.status(201).json(newPhoneboookEntry)
})

app.use((request, response, next) => {
    request.requestStartTime = new Date()
    next()
})

app.get('/info', (request, response) => {
    const receivedTime = request.requestStartTime
    response.send(
        `<p>Phonebook has info for ${phonebookEntries.length} people</p>
        <p>Request received at: ${receivedTime}</p>`
    )
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Express app is listening to port ${PORT}`)
})