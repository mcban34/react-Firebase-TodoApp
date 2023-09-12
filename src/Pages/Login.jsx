import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword , GoogleAuthProvider, signInWithPopup , onAuthStateChanged } from "firebase/auth";
import {Link, useNavigate} from "react-router-dom"

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
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [auth])

    //!e-posta ve şifre ile giriş yap
    //!giriş başarılı ise ana sayfaya yönlendiridi
    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/home")
            })
            .catch((error) => {
                console.log("giriş yapılamadı!");
            });
    }

    //!google ile giriş yap
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            const user = auth.currentUser;
            console.log("Google ile giriş yapıldı:", user);
            navigate("/home")
        } catch (error) {
            console.error("Google ile giriş sırasında hata oluştu:", error);
        }
    }

    return (
        <div>
            <input type="text" placeholder='mail adresiniz' onKeyDown={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='şifreniz' onKeyDown={(e) => setSifre(e.target.value)} />
            <button onClick={login}>Giriş Yap</button>
            <button onClick={handleGoogleLogin}>Goole ile giriş yap!</button>
            <Link to='/register'>Kayıt Ol</Link>
        </div>
    )
}

export default Login