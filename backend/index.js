const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require("cors")
const path = require("path");
const app = express();
const port =4000;

app.use(cors())
app.use(bodyParser.json());


mongoose.connect("mongodb+srv://preetam:preetam@cluster0.wg3g3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log("mongo connected")
).catch((err)=>console.log(err)
)

const todoSchema = new mongoose.Schema({
    title:String,
    description:String,
    completed:{type:Boolean,default:false},
},{timeseries:true})

const Todo = mongoose.model("Todo",todoSchema)

app.get('/todos',async(req,res)=>{
    try{
        const todo = await Todo.find()
        res.json({todo})
    }
    catch(err){
        res.status(500).json({
            message:"not send"
        })
    }
})

app.get("/todos/:id",async(req,res)=>{
    try{
        if(! req?.params?.id){
            throw new Error("id is required")
        }
        const todo = await Todo.findById(req.params.id)
        if(!todo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json({todo})
    }
    catch(err){
        res.status(500).json({
            message:"error"
        })
    }
})

app.post("/todos",async(req,res)=>{
    const {title,description,completed} = req.body;
    try{
        const newTodo = new Todo({
            title,
            description,
            completed: completed || false
        })
        const saveTodo = await newTodo.save();
        return res.json(saveTodo)
    }catch(err){
        return res.json({
            message:"error in creating"
        })
    }
})

app.put('/todos/:id',async(req,res)=>{
    const {title,description,completed} = req.body;
    try{
        if(!req?.params?.id){
            throw new Error("id required")
        }
        const todo = await Todo.findById(req.params.id);
        if(!todo){
            return res.status(404).json({message:"Todo not found"})
        }
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.completed = completed || todo.completed;

        const updatedTodo = await todo.save();
        res.send(updatedTodo);

    }
    catch(err){
        res.status(500).json({message:"Error updating todo"})
    }
})

app.delete("/todos/:id",async (req,res)=>{
    try{
        if(!req?.params?.id){
            throw new Error("id required")
        }
        const todo = await Todo.findByIdAndDelete(req.params.id);
    }
    catch(err){
        res.json({message:"ckdmcd"})
    }
})



const frontendPath = path.resolve(__dirname, "../frontend/dist");
console.log(frontendPath);

app.use(express.static(frontendPath));


app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(port,()=>{
    console.log("server running on 4000")
})