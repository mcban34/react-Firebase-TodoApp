import React from 'react'

function HomeHead({userEmail,handleLogout}) {
    return (
        <div>
            <h3>{userEmail}</h3>
            <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
    )
}

export default HomeHead