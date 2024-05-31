import { useAuth } from '../context/loginContext';


export const logout = async () => {
    console.log('=============>CONTROL======')
    const { clearAuthData } = useAuth();
    const [isLoggedIn, setLoggedIn] = useState(null);  
    try {
      await clearAuthData();
      setLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


