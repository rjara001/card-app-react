import { createContext, useEffect, useState } from 'react';
import { IUserInfo } from '../interfaces/IUserInfo';
import { Adapter } from '../locals/adapter';
import { globalUserDefault } from '../util/util';

// Create the context with an initial value of null for userInfo
export const UserContext = createContext<{ userInfo: IUserInfo, updateValue: (newObj: IUserInfo) => void }>({
    userInfo: globalUserDefault,
    updateValue: (newObj: IUserInfo) => {}
});

// Define the context provider
export function UserContextProvider(props: any) {
    const [userInfo, setUserInfo] = useState<IUserInfo>(globalUserDefault);

    useEffect(() => {
        const fetchUser = async () => {
            const user = {...await Adapter.getUser()}; // Await the promise
            setUserInfo(user); // Set the state once the user data is available
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
