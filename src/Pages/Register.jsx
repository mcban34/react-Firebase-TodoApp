import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTH,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE,
    messagingSenderId: process.env.REACT_APP_MESSAGING,
    appId: process.env.REACT_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

function Register() {

    const navigate = useNavigate(); // useNavigate Hook'unu kullanın
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const kayitOl = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                alert("Kayıt Tamam!")
                navigate("/Home");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    }

    return (
        <div>
            <input type="text" placeholder='email' onKeyDown={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder='sifre' onKeyDown={(e) => setPassword(e.target.value)} />
            <button onClick={kayitOl}>Kayıt Ol</button>
        </div>
    )
}

export default Register