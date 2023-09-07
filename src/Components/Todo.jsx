import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, useAuth, setPersistence } from "firebase/auth";
import { getDatabase, ref, set, update, onValue, push,remove } from 'firebase/database';


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
    const [todosArray, setTodosArray] = useState([])

    const addTodo = () => {
        const user = auth.currentUser;
        if (user) {
            // Yeni bir rastgele kimlik (ID) oluşturun
            const newTodoId = push(ref(db, `users/${user.uid}/todos`)).key;

            //! Yeni yapılacak işi bir obje olarak tutun
            const newTodo = {
                text: todo,
                completed: false,
                todoId:newTodoId
            };

            //! Yapılacak işi Firebase'e kaydet
            const todoRef = ref(db, `users/${user.uid}/todos/${newTodoId}`);
            set(todoRef, newTodo)
                .then(() => {
                    setTodo("");
                })
                .catch(error => {
                    console.error('Veri ekleme hatası:', error);
                });
        }
    }

    const deleteTodo = (todoId) => {
        const user = auth.currentUser;
        if (user) {
            console.log("use içerisne girdi!!");
            const todoRef = ref(db, `users/${user.uid}/todos/${todoId}`);
            console.log(todoRef);
            // Yapılacak işi silme işlemi
            remove(todoRef)
                .then(() => {
                    // Silme başarılı oldu, gerekirse ek işlemleri burada yapabilirsiniz.
                    console.log("silme işlemi başarılı!");
                })
                .catch(error => {
                    console.error('Veri silme hatası:', error);
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
                    todosArray.length != 0 ? (
                        todosArray.slice().reverse().map((value, index) => (
                            <li key={index}>{value.text} <button onClick={() => deleteTodo(value.todoId)}>Yapıldı</button></li>
                        ))
                    ) : (<h2>Henüz Todo Yok!</h2>)
                }
            </ul>
        </div>
    )
}

export default Todo