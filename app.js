// returns a function you can use to create an express application
const express = require('express') 
const cors = require('cors')
const app = express() // creates express app
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000 // where server listens
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI)
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo!")
})
mongoose.connection.on('error', (err)=>{
    console.log("error connecting",err)
})

require('./models/user')
require('./models/post')

app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

// starts express server and listens on PORT
app.listen(PORT,()=>{
    console.log("server is running on", PORT)
})