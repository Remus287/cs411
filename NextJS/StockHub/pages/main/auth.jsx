//Created on Thu Nov  9 15:56:58 2023

// @author: vincentcohen


import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <div>
        <h2>React Google Login</h2>
        {profile ? (
            <div>
                <img src={profile.picture} alt="user image" />
                <h3>User Logged in</h3>
                <p>Name: {profile.name}</p>
                <p>Email Address: {profile.email}</p>
                <button onClick={logOut}>Log out</button>
            </div>
        ) : (
            <button onClick={() => login()}>Sign in with Google 🚀 </button>
        )}
    </div>
    );
}
export default App;
