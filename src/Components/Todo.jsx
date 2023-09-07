import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, onValue, push, remove } from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTH,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE,
    messagingSenderId: process.env.REACT_APP_MESSAGING,
    appId: process.env.REACT_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

function Todo() {
    const [todo, setTodo] = useState('');
    const [todosArray, setTodosArray] = useState([]);
    const [loading, setLoading] = useState(true);

    const addTodo = () => {
        const user = auth.currentUser;
        if (user) {
            const newTodoId = push(ref(db, `users/${user.uid}/todos`)).key;

            const newTodo = {
                text: todo,
                completed: false,
                todoId: newTodoId,
            };

            const todoRef = ref(db, `users/${user.uid}/todos/${newTodoId}`);
            set(todoRef, newTodo)
                .then(() => {
                    setTodo('');
                })
                .catch((error) => {
                    console.error('Veri ekleme hatası:', error);
                });
        }
    };

    const deleteTodo = (todoId) => {
        const user = auth.currentUser;
        if (user) {
            const todoRef = ref(db, `users/${user.uid}/todos/${todoId}`);
            remove(todoRef)
                .then(() => {
                    console.log('Silme işlemi başarılı!');
                })
                .catch((error) => {
                    console.error('Veri silme hatası:', error);
                });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const starCountRef = ref(db, `users/${user.uid}/todos`);
                onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setTodosArray(Object.values(data));
                    } else {
                        setTodosArray([]);
                    }
                    setLoading(false);
                });
            } else {
                setTodosArray([]);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [auth]);

    return (
        <div>
            <input
                type="text"
                placeholder="İş ekle!"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button onClick={addTodo}>Ekle!</button>
            <ul>
                {loading ? (
                    <p>Yükleniyor...</p>
                ) : todosArray.length !== 0 ? (
                    todosArray.map((value) => (
                        <li key={value.todoId}>
                            {value.text}{' '}
                            <button onClick={() => deleteTodo(value.todoId)}>Yapıldı</button>
                        </li>
                    ))
                ) : (
                    <h2>Henüz Todo Yok!</h2>
                )}
            </ul>
        </div>
    );
}

export default Todo;
