import React, { useState } from 'react'

function Todo() {
    const [todos,setTodos] = useState([])
    const [todoİnput,setTodoİnput] = useState("")

    const addTodo = () => {
        setTodos([...todos,todoİnput])
        console.log(todos);
    } 

  return (
    <div>
        <input type="text" placeholder='iş ekle!' onKeyUp={(e) => setTodoİnput(e.target.value)} />
        <button onClick={addTodo}>Ekle!</button>

        <ul>
            {
                todos.map((value,index) => {
                   return <li key={index}>{value}</li>
                })
            }
        </ul>
    
    </div>
  )
}

export default Todo