const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

//Configuring Express
app.use(express.json())                                                        //Automatically parse incoming json
app.use(userRouter)
app.use(taskRouter)

//spin up the server
app.listen(port, () => {
    console.log('Server is up on port ' +port);
})