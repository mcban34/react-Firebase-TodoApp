import React from 'react'

function HomeHead({userEmail,handleLogout}) {
    return (
        <div className='homeHead'>
            <p>{userEmail}</p>
            <button className='quitButton' onClick={handleLogout}>Çıkış Yap</button>
        </div>
    )
}

export default HomeHead