import React from 'react'

function CompletedTodo({valueKey,valueText}) {
    return (
        <li className='completedTodo' key={valueKey}>
            {valueText}
        </li>
    )
}

export default CompletedTodo