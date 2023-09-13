import React from 'react'
import { AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';

function TodoList({ values, text, tarih, saat, deleteTodo, completedTodo }) {
    return (
        <div className='todoList'>
            <div className="todoListTop">
                <div className="todoListTopContainer">
                    <h5 className=''>{text}</h5>
                    <div className="todoListTopSpans">
                        <span className='tarih'><BsCalendarDate />{tarih}</span>
                        <span className='saat'><BiTimeFive />{saat}</span>
                    </div>
                </div>
            </div>
            <div className="todoListButton">
                <button className='completeButton' onClick={() => completedTodo(values.todoId)}><AiOutlineCheckCircle /></button>
                <button className='deleteButton' onClick={() => deleteTodo(values.todoId)}><AiOutlineDelete /></button>
            </div>
        </div>
    )
}

export default TodoList