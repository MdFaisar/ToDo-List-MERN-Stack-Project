//Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//instance of express
const app =express();
app.use(express.json())
app.use(cors())
//let todos = []; 

//mongodb connection

mongoose.connect('mongodb://127.0.0.1:27017/todo_db')

.then(() =>{
    console.log('Db connected')
})
.catch((err) => {
    console.log(err)
})

//schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//model
const todoModel = mongoose.model('ToDo', todoSchema);

//route - new todo item
app.post('/todos', async (req,res) => {
    const {title, description} = req.body;
    // const newTodo ={
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try{
        const newTodo = new todoModel({title, description})
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        
    }
})

//get items
app.get('/todos',async (req,res) => {
    try{
        const todos = await todoModel.find();
        res.json(todos);
    }catch (error){
        console.log(error);
        res.status(500).json({message: error.message})
    }  
})

//update todo
app.put('/todos/:id',async (req,res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatetodo = await todoModel.findByIdAndUpdate(
            id,
            {title ,description},
            {new: true}
        )
        if(!updatetodo)
        {
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatetodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

//delete
app.delete('/todos/:id',async (req,res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

//start the server
const port = 8000;
app.listen(port,() =>{
    console.log("Server is listening to port:" + port);
})