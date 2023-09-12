import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { signOut, getAuth, onAuthStateChanged} from "firebase/auth";
import Todo from '../Components/Todo';
import {Container,Row,Col} from 'react-bootstrap'
import HomeHead from '../Components/HomeHead/HomeHead';


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


function Home() {
  const [userEmail,setUserEmail] = useState("")
  const navigate = useNavigate();


  //!Çıkış işlemi
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Çıkış işlemi başarılı!");
      })
      .catch((error) => {
        console.error("Çıkış işlemi sırasında hata oluştu", error);
      });
  }

  //!kullanıcı olmadığı durumda ./register sayfasına yönlendirdim
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
      else{
        setUserEmail(user.email)
      }
    });
    return () => unsubscribe();
  }, [auth])

  return (
    <div className='home'>
      <Container>
        <HomeHead
          userEmail={userEmail}
          handleLogout={handleLogout}
        />
        <Todo/>
      </Container>
    </div>
  )
}

export default Home