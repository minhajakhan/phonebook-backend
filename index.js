require('dotenv').config()
const Entry = require('./models/phonebook')
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
// app.use(morgan('tiny'))
app.use(express.static('dist'))

let phonebookEntries = []

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
//   }
// app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Entry.findById(request.params.id)
    .then(entry => {
        if (entry) {
            response.json(entry)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if ( !body.name || !body.number ) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const newPhoneboookEntry = new Entry({
        name: body.name,
        number: body.number
    })

    newPhoneboookEntry.save()
    .then(savedEntry => {
        response.json(savedEntry)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Entry.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    Entry.findById(request.params.id)
    .then(entry => {
        if (!entry) {
            return response.status(404).end()
        }
        if (name === entry.name) {
            entry.number = number
        }
        return entry.save().then(updatedEntry => {
            response.json(updatedEntry)
        })
    })
    .catch(error => next(error))
})


app.use((request, response, next) => {
    request.requestStartTime = new Date()
    next()
})

app.get('/info', (request, response) => {
    const receivedTime = request.requestStartTime
    Entry.find({}).then(entries => {
        response.send(
            `<p>Phonebook has info for ${entries.length} people</p>
            <p>Request received at: ${receivedTime}</p>`
        )
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)  

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Express app is listening to port ${PORT}`)
})