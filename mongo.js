// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//     console.log('give password as argument')
//     process.exit(1)
//   }

// const password = process.argv[2]

// const url = `mongodb+srv://minhajiialamkhan_db_user:${password}@cluster0.rgkjaug.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)

// mongoose.connect(url, { family: 4 })

// const phonebookSchema = new mongoose.Schema({
//     name: String,
//     number: String,
//   })
  
// const Entry = mongoose.model('Entry', phonebookSchema)

// if (process.argv[3] && process.argv[4]) {
//     const entry = new Entry({
//         name: process.argv[3],
//         number: process.argv[4],
//       })
      
//       entry.save().then(result => {
//         console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
//       //   mongoose.connection.close()
//       })
// }

// else if (process.argv.length === 3) {
//     console.log('phonebook:')
//     Entry.find({}).then(result => {
//         result.forEach(entry => {
//           console.log(entry.name, entry.number)
//         })
//         mongoose.connection.close()
//       })
// }
