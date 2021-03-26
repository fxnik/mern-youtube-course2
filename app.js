const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

//mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

//----------------------------------------------------------

if (process.env.NODE_ENV === 'production') 
{
  app.use('/', express.static(path.join(__dirname, 'client', 'build'))) //если запрос на корень пиложения 

  app.get('*', (req, res) => // '*' - любой гет-запрос
  {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

//----------------------------------------------------------

const PORT = config.get('port') || 5000

//mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

async function start() 
{
   try 
   {
     await mongoose.connect(config.get('mongoUri'), {  
       useNewUrlParser: true,
       useUnifiedTopology: true,
       useCreateIndex: true
     })

     console.log('Well Done')

     app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
   } 
   catch (e) 
   {
     console.log('Server Error', e.message)
     process.exit(1)
   }
 }

 

start()

//mongodb+srv://vladilen:86128612@cluster0.qct89.mongodb.net/test  //mongodb://localhost:27017/node-demo 