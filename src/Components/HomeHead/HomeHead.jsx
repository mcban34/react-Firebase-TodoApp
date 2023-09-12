import React from 'react'

function HomeHead({userEmail,handleLogout}) {
    return (
        <div className='homeHead'>
            <h5>{userEmail}</h5>
            <button className='quitButton' onClick={handleLogout}>Çıkış Yap</button>
        </div>
    )
}

export default HomeHead