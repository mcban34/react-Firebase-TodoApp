import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';

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
const googleProvider = new GoogleAuthProvider();

function Register() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName,setUserName] = useState("")

    //!Kullanıcın girişli olup olmadığını kontrol ettim
    //!kullanıcı girişi varsa, doğrudan ana sayfaya yönlendirme yaptım
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [auth])

    //!e-posta şifre ile kayıt işlemi
    const kayitOl = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/Home"); //? => sayfa yönlendirici
                
                //!user uid'sine göre veri kaydı
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                set(userRef,{
                    userName:userName,
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    //!google ile giriş yapımı
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Google ile giriş yapıldı:", user);
        } catch (error) {
            console.error("Google ile giriş sırasında hata oluştu:", error);
        }
    }

    return (
        <div>
            <input type="text" placeholder='Kullanıcı Adı' onKeyDown={(e) => setUserName(e.target.value)} />
            <input type="text" placeholder='email' onKeyDown={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder='sifre' onKeyDown={(e) => setPassword(e.target.value)} />
            <button onClick={kayitOl}>Kayıt Ol</button>
            <button onClick={handleGoogleLogin}>Google İle Kayı Ol</button>
        </div>
    )
}

export default Register