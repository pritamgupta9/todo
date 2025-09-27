import React from 'react'
import axios from "axios";
import { useEffect } from 'react';
import { useState } from 'react';

const App = () => {
  const [todos,setTodos] = useState([])
  const [title,setTitle] = useState("");
  const fetchTodo =async()=>{
   let data = await axios.get(`http://localhost:4000/todos`)
   console.log(data);
   setTodos([...data?.data?.todo])
  }
  const addTodo = async()=>{
    let data = await axios.post(`http://localhost:4000/todos`,{
      title,
      description:title
    })
   console.log(data.data?.todo);
   setTitle("")
   fetchTodo()


  }
  const updateTodo =async(data1)=>{
    console.log(data1);
    
    let data = await axios.put(`http://localhost:4000/todos/${data1._id}`, {
      completed:true
    })
    fetchTodo()

  }
  const deleteTodo = async(data1)=>{
    console.log(data1);
    
   let data = await axios.delete(`http://localhost:4000/todos/${data1._id}`)
    setTodos(prev => prev.filter(todo => todo?._id !== data1?._id));
    fetchTodo()

  }
  useEffect(()=>{
    fetchTodo()
  },[])
  return (
    <div>
      <h1>
        My Todo App
      </h1>
      <h4>Add todo</h4>
      <div>
        <input type="text" onChange={(e)=>setTitle(e.target.value)} value={title} />
        <input type="submit" onClick={addTodo} />
      </div>
      {todos && todos.length ? todos.map((t) => (
  <div key={t._id}>
    <button onClick={() => updateTodo(t)}>update</button>
    <h1>{t.title}</h1>
    <p>{t.description}</p>
    <p>completed: {String(t.completed)}</p>
    <button onClick={() => deleteTodo(t)}>delete</button>
  </div>
)):"nof"}
      
    </div>

  )
}

export default App