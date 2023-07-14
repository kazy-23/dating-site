import Login from './components/Login';
import Main from './components/Main';
import Navbar from './components/Navbar';
import { auth } from './firebase';
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Navbar />
      {user ? <Main /> : <Login />}
    </>
  );
}

export default App;
