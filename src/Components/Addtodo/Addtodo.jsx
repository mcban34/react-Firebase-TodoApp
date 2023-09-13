import React from 'react'
import { IoAddCircleSharp } from 'react-icons/io5';
// GrAddCircle

function Addtodo({ valueAddTodo, addTodoOnChange,addTodo }) {
    return (
        <div className='addTodo'>
            <input
                type="text"
                placeholder="Görev Ekle..."
                value={valueAddTodo}
                onChange={addTodoOnChange}
            />
            <button className='addTodoButton' onClick={addTodo}><IoAddCircleSharp/>Ekle</button>
        </div>
    )
}

export default Addtodo