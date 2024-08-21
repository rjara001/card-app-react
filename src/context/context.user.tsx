import { createContext, useEffect, useState } from 'react';
import { IUserInfo } from '../interfaces/IUserInfo';
import { Adapter } from '../locals/adapter';
import { globalUserDefault } from '../util/util';
import { TokenExpiredError } from '../models/Error';
import { useNavigate } from 'react-router-dom';

// Create the context with an initial value of null for userInfo
export const UserContext = createContext<{ userInfo: IUserInfo, updateValue: (newObj: IUserInfo) => void, loadUser: () => void}>({
    userInfo: globalUserDefault,
    updateValue: (newObj: IUserInfo) => {},
    loadUser: () => {} // Default no-op function
});

// Define the context provider
export function UserContextProvider(props: any) {
    const [userInfo, setUserInfo] = useState<IUserInfo>(globalUserDefault);
    const navigate = useNavigate();
    
    const loadUser = async () => {
        try {
            const user = await Adapter.getUser(); // Fetch the user data
            updateValue(user); // Update the state with the fetched user data
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                updateValue(globalUserDefault); // Reset to default on token expiration
                navigate('/'); // Navigate to the login page
            } else {
                console.error('Failed to fetch user data:', error);
            }
        }
    };

    useEffect(() => {
        loadUser(); // Call loadUser when the component mounts
    }, []); // Include navigate in dependency array

    const updateValue = (newObj: IUserInfo) => {
        setUserInfo(prevState => ({ ...prevState, ...newObj }));
        Adapter.setUser(newObj);    
    };

    const userContext = {
        userInfo,
        updateValue,
        loadUser
    };


    return (
        <UserContext.Provider value={userContext}>
            {props.children}
        </UserContext.Provider>
    );
}
