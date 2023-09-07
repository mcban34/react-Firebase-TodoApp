import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, useAuth, setPersistence } from "firebase/auth";
import { getDatabase, ref, set, update, onValue, push } from 'firebase/database';


const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTH,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE,
    messagingSenderId: process.env.REACT_APP_MESSAGING,
    appId: process.env.REACT_APP_ID
};

const app = initializeApp(firebaseConfig);
let auth = getAuth();
const db = getDatabase();


function Todo() {
    const [todo, setTodo] = useState("")
    const [todosArray,setTodosArray] = useState([])

    const addTodo = () => {
        const user = auth.currentUser;
        if (user) {
            //!yeni todoyu bir obje halinde elinde tut
            const newTodo = {
                text: todo,
                completed: false,
            };

            //!işi firebaseye kaydet
            const todosRef = ref(db, `users/${user.uid}/todos`);
            push(todosRef, newTodo)
                .then(() => {
                    setTodo("");
                })
                .catch(error => {
                    console.error('Veri ekleme hatası:', error);
                });
        }
    }

    //!sayfa yenilendiğinde yada ilk girildiğinde todoları alıp ekrana yazdır
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getDatabase();
                const starCountRef = ref(db, `users/${user.uid}/todos`);
                onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();
                    setTodosArray(Object.values(data))
                });
            }
        });
        
    }, [auth])

    return (
        <div>
            <input type="text" placeholder='iş ekle!' onKeyUp={(e) => setTodo(e.target.value)} />
            <button onClick={addTodo}>Ekle!</button>
             <ul>
                {   
                    todosArray!="" ? (
                        todosArray.map((value, index) => {
                            return <li key={index}>{value.text}</li>
                        })
                    )  : (<h2>Henüz Todo Yok!</h2>)
                }
            </ul> 
        </div>
    )
}

export default Todo