import express from 'express'
import authController from './modules/user/user.controller.js'
import noteController from "./modules/note/note.controller.js";
import connectDB from './DB/connection.db.js';

const bootstrap = async () => {
    const app = express()
    const port = 3000
    app.use(express.json())
    //DB
    await connectDB()

    //app routing
    app.get('/', (req, res, next) => {
        res.json('welcome to example app')
    })
    app.use('/user', authController)
    app.use('/notes',noteController)



    app.all('{/*dummy}', (req, res, next) => {
        res.status(500).json('Invalid Routing')
    })
    app.listen(port, () => {
        console.log(`server is running on port ::: ${port}`)
    })
}
export default bootstrap