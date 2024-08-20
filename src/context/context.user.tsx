import { createContext, useEffect, useState } from 'react';
import { IUserInfo } from '../interfaces/IUserInfo';
import { Adapter } from '../locals/adapter';
import { globalUserDefault } from '../util/util';
import { TokenExpiredError } from '../models/Error';
import { useNavigate } from 'react-router-dom';

// Create the context with an initial value of null for userInfo
export const UserContext = createContext<{ userInfo: IUserInfo, updateValue: (newObj: IUserInfo) => void }>({
    userInfo: globalUserDefault,
    updateValue: (newObj: IUserInfo) => {}
});

// Define the context provider
export function UserContextProvider(props: any) {
    const [userInfo, setUserInfo] = useState<IUserInfo>(globalUserDefault);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = {...await Adapter.getUser()}; // Await the promise
                updateValue(user); // Set the state once the user data is available
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    updateValue(globalUserDefault);
                    navigate('');
                } else {
                    // setIsSyncSuccessful(false);
                    return;
                }
            }
            
        };

        fetchUser();
    }, []); // Empty dependency array means this effect runs once after the component mounts.

    const updateValue = (newObj: IUserInfo) => {
        setUserInfo(prevState => ({ ...prevState, ...newObj }));
        Adapter.setUser(newObj);
    };

    const userContext = {
        userInfo,
        updateValue
    };

    return (
        <UserContext.Provider value={userContext}>
            {props.children}
        </UserContext.Provider>
    );
}
