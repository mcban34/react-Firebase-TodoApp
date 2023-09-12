import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';
import { Row, Col, Container, Collapse } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

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
    const [passwordAgain, setPasswordAgain] = useState("")
    const [userName, setUserName] = useState("")
    const [errorAlert, setErrorAlert] = useState(null);

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

    const passAlert = (alertTex) => {
        setErrorAlert(alertTex)
    }

    //!e-posta şifre ile kayıt işlemi
    const kayitOl = () => {
        if (password == passwordAgain) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    navigate("/Home"); //? => sayfa yönlendirici

                    //!user uid'sine göre veri kaydı
                    const db = getDatabase();
                    const userRef = ref(db, `users/${user.uid}`);
                    set(userRef, {
                        todos: "",
                        userName: userName,
                    })
                })
                .catch((error) => {
                    const errorCode = error.code;

                    if (errorCode == "auth/invalid-email") {
                        passAlert("Geçersin E-posta")
                    }
                    else if (errorCode == "auth/missing-password") {
                        passAlert("Geçersin Şifre!")
                    }
                    else if (errorCode == "auth/weak-password") {
                        passAlert("Zayıf Şifre")
                    }
                });
        }
        else {
            setErrorAlert("Şifreler Uyuşmuyor!")
        }
    }

    //!google ile giriş yapımı
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            set(userRef, {
                todos: "",
                userName: user.displayName,
            })
            console.log("Google ile giriş yapıldı:", user);
        } catch (error) {
            console.error("Google ile giriş sırasında hata oluştu:", error);
        }
    }

    return (
        <div className='registerApp'>
            <Container>
                <Row>
                    <Col lg={5} className='align-self-center '>
                        <div className="registerForm py-5 px-4">
                            <h3>Kayıt Ol</h3>
                            <p>Kayıt Olmak İçin Lütfen Formu Doldurun!</p>
                            <input type="text" placeholder='Kullanıcı Adı' onKeyDown={(e) => setUserName(e.target.value)} />
                            <input type="email" placeholder='E-mail' onKeyDown={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder='Şifre' onKeyDown={(e) => setPassword(e.target.value)} />
                            <input type="password" placeholder='Şifre Tekrar' onKeyDown={(e) => setPasswordAgain(e.target.value)} />
                            <button className='formButton' onClick={kayitOl}>Kayıt Ol</button>
                            <button className='formButton' onClick={handleGoogleLogin}>Google İle Kayı Ol</button>
                            <h6 className='mt-2'>Hesabın Var mı? <Link to={'/'}>Giriş Yap</Link></h6>
                            {
                                errorAlert && (
                                    <Alert transition={Collapse} variant={"danger"} className='mt-3' onClose={() => setErrorAlert(null)} dismissible>
                                        {errorAlert}
                                    </Alert>
                                )
                            }
                        </div>
                    </Col>
                    <Col lg={7} className='text-center d-none d-lg-block'>
                        <img width={500} src="img/register-right.png" alt="" />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Register