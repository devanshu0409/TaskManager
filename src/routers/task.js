const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,                  // copy req.body to task object
        owner: req.user._id
    })

    try{
        const savedTask = await task.save()
        res.status(201).send(savedTask)

    }catch(e){
        res.status(400).send(e)
    }

})

//get all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === "true"
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        //const tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)

    }catch(e){
        res.status(500).send(e)
    }

})

//get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id 

    try{
        //const task = await Task.findById({_id})
        const task = await Task.findOne({ _id, owner: req.user._id })

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
        const updatedTask = await Task.findOne({ _id , owner: req.user._id })

        if(!updatedTask){
            return res.status(404).send('Task not found!')
        }

        updates.forEach((update) => updatedTask[update] = req.body[update])
        await updatedTask.save()

        res.status(200).send(updatedTask)

    } catch(e){
        res.status(500).send(e)
    }

})

//delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        const deletedTask = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if(!deletedTask){
            return res.status(404).send('Task not found!')
        }

        res.status(200).send(deletedTask)

    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router