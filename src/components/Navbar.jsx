import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
    const [user] = useAuthState(auth);
    const logout = ()=>{
        signOut(auth);
    }

    return (
        <nav>
            <div className="logo"><p><b>Pinder</b></p></div>
            {user && <div><a href="#0" onClick={logout}>Log out</a></div>}
        </nav>
    )
}

export default Navbar