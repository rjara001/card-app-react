import { createContext, useEffect, useState } from 'react';
// import { globalUserDefault } from '../util/util';
import { IUserInfo } from '../interfaces/IUserInfo';
import { Adapter } from '../locals/adapter';


// Create the context
export const UserContext = createContext({ userInfo: Adapter.getUser(), updateValue: (newObj: IUserInfo) => { } });

// Define the context provider
export function UserContextProvider(props: any) {
    function useInitialContextValue() {
        const [initialValue, setInitialValue] = useState<IUserInfo>(Adapter.getUser());

        useEffect(() => {
            const storedValue = Adapter.getUser();
            if (storedValue) {
                setInitialValue(storedValue);
            }
        }, []);

        return initialValue;
    }

    const UserContextValue = useInitialContextValue();
    const [userInfo, setUserInfo] = useState<IUserInfo>(UserContextValue);

    const userContext = {
        userInfo, updateValue: (newObj: IUserInfo) => {
            setUserInfo(prevState => ({ ...prevState, ...newObj }));
        }
    };

    return (
        <UserContext.Provider value={userContext}>
            {props.children}
        </UserContext.Provider>
    );
}

