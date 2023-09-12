import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import { getErrorMessage } from '../Helper/errorService';

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
    const [errorAlert, setErrorAlert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [auth])


    //! helper servicesi çalıştıran fonksiyon
    const runPassService = (errorCodeParam) => {
        const errorMessage = getErrorMessage(errorCodeParam);
        setErrorAlert(errorMessage);
    }

    //!e-posta ve şifre ile giriş yap
    //!giriş başarılı ise ana sayfaya yönlendiridi
    const login = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/home")
            })
            .catch((error) => {
                const errorCode = error.code
                runPassService(errorCode)
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
        <div className='loginRegister'>
            <Container>
                <Row>
                    <Col lg={5} className='align-self-center'>
                        <div className="loginRegisterForm py-5 px-4">
                            <h3>Giriş Yap</h3>
                            <p>Giriş Yapmak İçin Lütfen Formu Doldurun!</p>
                            <form onSubmit={login}>
                                <input type="email" placeholder='E-mail' onKeyDown={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder='Şifre' onKeyDown={(e) => setSifre(e.target.value)} />
                                <input value={"Giriş Yap"} type="submit" className='formButton' />
                            </form>
                            <button className='formButton' onClick={handleGoogleLogin}>Goole ile giriş yap!</button>
                            <h6 className='mt-2'>Hesabın Yok mu? <Link to='/'>Kayıt Ol</Link></h6>
                            {
                                errorAlert && (
                                    <Alert variant={"danger"} className='mt-3' onClose={() => setErrorAlert(null)} dismissible>
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

export default Login