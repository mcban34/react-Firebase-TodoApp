import React from 'react'
import { AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';

function TodoList({ values, text, tarih, saat, deleteTodo, completedTodo }) {
    return (
        <div className='todoList'>
            <h5>{text}</h5>
            <span className='tarih'>{tarih}</span>
            <span className='saat'>{saat}</span>
            <div className="todoListButton">
                <button className='completeButton' onClick={() => completedTodo(values.todoId)}><AiOutlineCheckCircle /></button>
                <button className='deleteButton' onClick={() => deleteTodo(values.todoId)}><AiOutlineDelete /></button>
            </div>
        </div>
    )
}

export default TodoList