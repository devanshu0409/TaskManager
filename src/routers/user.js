const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const savedUser = await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ savedUser, token })

    }catch(e){
        res.status(400).send(e)
    }
    
})

//login
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    }catch(e) {
        res.status(400).send(e)
    }
})

//logout current session
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()

    }catch(e) {
        res.status(500).send(e)
    }
})

//logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()

    }catch(e) {
        res.status(500).send(e)
    }
})

//get profile of logged in user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//get user by id
router.get('/users/:id', auth, async (req, res) => {
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

//get all users
router.get('/users', async (req, res) => {

    try{
        const users = await User.find({})
        res.status(200).send(users)

    }catch(e){
        res.status(500).send(e)
    }

})

//update logged in user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({Error : 'Invalid updates!'})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.status(200).send(req.user)

    } catch(e){
        res.status(500).send(e)
    }

})

//update user
router.patch('/users/:id', auth, async (req, res) => {
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

//delete logged in user
router.delete('/users/me', auth, async (req, res) => {

    try{
        await req.user.remove()
        res.status(200).send(req.user)

    }catch(e){
        res.status(500).send(e)
    }
})

//delete user
router.delete('/users/:id', auth, async (req, res) => {
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