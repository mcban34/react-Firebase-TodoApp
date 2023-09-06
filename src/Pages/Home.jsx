import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { signOut, getAuth, onAuthStateChanged, useAuth, setPersistence  } from "firebase/auth";
import Todo from '../Components/Todo';


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
    });
    return () => unsubscribe();
  }, [auth])

  return (
    <div>
      Home
      <button onClick={handleLogout}>Çıkış Yap</button>
      <br /><br /><br /><br />
      <Todo/>
    </div>
  )
}

export default Home