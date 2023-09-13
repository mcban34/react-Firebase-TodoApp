import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, onValue, push, remove, update } from 'firebase/database';
import TodoList from '../TodoList/TodoList';
import { Container, Row, Col } from 'react-bootstrap'
import CompletedTodo from '../CompletedTodo/CompletedTodo';
import Addtodo from '../Addtodo/Addtodo';

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
    const [completedData, setCompletedData] = useState([])

    //!yeni todolar ekle
    const addTodo = () => {
        const suan = new Date();

        const ay = suan.getMonth() + 1;
        const gun = suan.getDate();
        const yil = suan.getFullYear();
        const saat = suan.getHours();
        const dakika = suan.getMinutes();

        const user = auth.currentUser;
        if (user) {
            const newTodoId = push(ref(db, `users/${user.uid}/todos`)).key;

            const newTodo = {
                text: todo,
                completed: false,
                todoId: newTodoId,
                tarih: `${gun}/${ay}/${yil}`,
                saat: `${saat}:${dakika}`
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

    //! todolar yapıldı olarak işaretlendi 
    const completedTodo = (todoId) => {
        const user = auth.currentUser;
        const todoIds = ref(db, `users/${user.uid}/todos/${todoId}`);
        if (user) {
            update(todoIds, {
                completed: true
            })
                .then(() => {
                    console.log("yapıldı işlemi tamamlandı!");
                })
                .catch((error) => {
                    console.error('yapıldı işlem hatası:', error);
                });
        }
    }

    //! yapılan todo silindi
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const starCountRef = ref(db, `users/${user.uid}/todos`);
                onValue(starCountRef, (snapshot) => {
                    const data = Object.values(snapshot.val());
                    const complateTodo = data.filter(value => value.completed == true)
                    setCompletedData(complateTodo)
                });
            }
        });
    }, [auth])

    return (
        <div>
            <Row className='justify-content-center'>
                <Col lg={5} className=''>
                    <Addtodo
                        valueAddTodo={todo}
                        addTodoOnChange={(e) => setTodo(e.target.value)}
                        addTodo={addTodo}
                    />
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col lg={7}>
                    <ul className='TodosUl'>
                        <h2 className='text-center'>Atanan İşler</h2>
                        {loading ? (
                            <p>Yükleniyor...</p>
                        ) : todosArray.length !== 0 ? (
                            todosArray.slice().reverse().map((value) => (
                                value.completed === false ? (
                                    <li key={value.todoId} className='todoLi'>
                                        <TodoList
                                            values={value}
                                            text={value.text}
                                            tarih={value.tarih}
                                            saat={value.saat}
                                            deleteTodo={deleteTodo}
                                            completedTodo={completedTodo}
                                        />
                                    </li>
                                ) : null
                            ))
                        ) : (
                            <h2>Henüz Todo Yok!</h2>
                        )}
                    </ul>
                </Col>
                <Col lg={5}>
                    <ul className='TodosUl'>
                        <h2 className='text-center'>Yapılan İşler</h2>

                        {completedData.length !== 0 ? (
                            completedData.map((value) => (
                                <CompletedTodo
                                    valueKey={value.todoId}
                                    valueText={value.text}
                                />
                            ))
                        ) : (
                            <h2>Henüz Yapılan İş Yok!</h2>
                        )}
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default Todo;
