const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task(req.body)

    try{
        const savedTask = await task.save()
        res.status(201).send(savedTask)

    }catch(e){
        res.status(400).send(e)
    }

})

//get all tasks
router.get('/tasks', auth, async (req, res) => {

    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)

    }catch(e){
        res.status(500).send(e)
    }

})

//get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id 

    try{
        const task = await Task.findById({_id})
        if(!task){
            return res.status(404).send('Task not found!')
        }

        res.status(200).send(task)

    }catch(e){
        res.status(500).send(e)
    }

})

//update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        res.status(400).send({Error : 'Invalid updates!'})
    }

    try{
        const updatedTask = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        if(!updatedTask){
            return res.status(404).send('Task not found!')
        }

        res.status(200).send(updatedTask)

    } catch(e){
        res.status(500).send(e)
    }

})

//delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        const deletedTask = await Task.findByIdAndDelete(_id)

        if(!deletedTask){
            return res.status(404).send('Task not found!')
        }

        res.status(200).send(deletedTask)

    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router