import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Login() {
    const [page, setPage] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('');

    const [incorrect, setIncorrect] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [missing, setMissing] = useState(false);

    const login = ()=>{
        signInWithEmailAndPassword(auth, email, password)
        .then((u)=>{
            setIncorrect(false);
            setEmail('');
            setPassword('');
        })
        .catch((e)=>{
            setIncorrect(true);
            setPassword('');
        })
    }

    const send = ()=>{
        sendPasswordResetEmail(auth, email)
        .catch((e)=>{
    
        });
        setSuccess(true);
        setEmail('');
    }

    const signup = ()=>{
        if(name==='' || desc==='' || img==='' || email==='' || password===''){
            setMissing(true)
            return;
        }
        setMissing(false);
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setDoc(doc(db, 'users', userCredential.user.uid), {
                name: name,
                desc: desc,
                img: img,
                id: userCredential.user.uid,
            })
        })
        .catch((e)=>{
            setError(true);
            console.log(e.message);
        })
    }
    
    return (
        <main>
            <div className='login'>
                {page === 0 && <>
                    <h1>Log in</h1>
                    {incorrect && <p>Invalid email or password.</p>}
                    <input type='text' placeholder='Email...' value={email} onChange={(e)=>setEmail(e.target.value)}/><br />
                    <input type='password' placeholder='Password...' value={password} onChange={(e)=>setPassword(e.target.value)}/><br />
                    <a href='#0' className='button' onClick={login}>LOG IN</a><br />
                    <br />
                    <a href='#0' onClick={()=>setPage(1)}>Forgot password?</a><br />
                    <a href='#0' onClick={()=>setPage(2)}>Don't have an account?</a><br />
                </>}
                {page === 1 && <>
                    <h1>Forgot password</h1>
                    {success && <p>If we find account with this email adress, we will send you an email.</p>}
                    <input type='text' placeholder='Email...' value={email} onChange={(e)=>setEmail(e.target.value)}/><br />
                    <a href='#0' className='button' onClick={send}>SEND</a><br />
                    <br />
                    <a href='#0' onClick={()=>setPage(0)}>Back to login.</a><br />
                    <a href='#0' onClick={()=>setPage(2)}>Don't have an account?</a><br />
                </>}
                {page === 2 && <>
                    <h1>Sign up</h1>
                    {missing && <p>All fields must be filled!</p>}
                    {error && <p>There was and error in the sign up process, check if you filled the fields correctly.</p>}
                    <input type='text' placeholder='Name...' value={name} onChange={(e)=>setName(e.target.value)}/><br />
                    <textarea type='text' placeholder='Description...' value={desc} onChange={(e)=>setDesc(e.target.value)}/><br />
                    <input type='text' placeholder='Image link...' value={img} onChange={(e)=>setImg(e.target.value)}/><br />
                    <input type='text' placeholder='Email...' value={email} onChange={(e)=>setEmail(e.target.value)}/><br />
                    <input type='password' placeholder='Password...'  value={password} onChange={(e)=>setPassword(e.target.value)}/><br />
                    <a href='#0' className='button' onClick={signup}>Sign up</a><br />
                    <br />
                    <a href='#0' onClick={()=>setPage(0)}>Already have an account?</a><br />
                </>}
            </div>
        </main>
    )
}

export default Login