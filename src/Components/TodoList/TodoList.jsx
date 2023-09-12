import React from 'react'

function TodoList({ values, text, tarih, saat, deleteTodo, completedTodo }) {
    return (
        <div>
            <h3>{text}</h3>
            <p>Tarih: {tarih}</p>
            <p>Saat: {saat}</p>
            <button onClick={() => deleteTodo(values.todoId)}>Sil</button>
            <button onClick={() => completedTodo(values.todoId)}>Tamamlandı</button>
        </div>
    )
}

export default TodoList