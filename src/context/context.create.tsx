import { createContext } from 'react';
import { IGlobalSummary } from '../interfaces/IGlobalSummary';
// import { IUserInfo } from '../interfaces/IUserInfo.js';
import { globalSummaryDefault, globalUserDefault } from '../util/util';

export const PlayContext = createContext({summary:globalSummaryDefault, updateValue:(newObj: IGlobalSummary)=>{}});

// export const UserContext = createContext({userInfo:globalUserDefault, updateValue:(newObj: IUserInfo)=>{}});