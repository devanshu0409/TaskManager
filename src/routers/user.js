const express = require('express')
const router = new express.Router()
const User = require('../models/user')

//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const savedUser = await user.save()
        res.status(201).send(savedUser)

    }catch(e){
        res.status(400).send(e)
    }
    
})

//get all users
router.get('/users', async (req, res) => {

    try{
        const users = await User.find({})
        res.status(200).send(users)

    }catch(e){
        res.status(500).send(e)
    }

})

//get user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id 

    try{
        const user = await User.findById({_id})
        if(!user){
            return res.status(404).send('User not found!')
        }

        res.status(200).send(user)

    }catch(e){
        res.status(500).send(e)
    }

})

//update user
router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({Error : 'Invalid updates!'})
    }

    try{
        //const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        const updatedUser = await User.findById(_id)

        if(!updatedUser){
            return res.status(404).send('User not found!')
        }
        
        updates.forEach((update) => updatedUser[update] = req.body[update])
        await updatedUser.save()

        res.status(200).send(updatedUser)

    } catch(e){
        res.status(500).send(e)
    }

})

//delete user
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const deletedUser = await User.findByIdAndDelete(_id)

        if(!deletedUser){
            return res.status(404).send('User not found!')
        }

        res.status(200).send(deletedUser)

    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router