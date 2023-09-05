import React, { useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

function Login() {
    const [email, setEmail] = useState("")
    const [password, setSifre] = useState("")

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                alert("kullanıcı girişi sağlandı")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode,errorMessage);
            });
    }

    return (
        <div>
            <input type="text" placeholder='mail adresiniz' onKeyDown={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='şifreniz' onKeyDown={(e) => setSifre(e.target.value)} />
            <button onClick={login}>Giriş Yap</button>
        </div>
    )
}

export default Login