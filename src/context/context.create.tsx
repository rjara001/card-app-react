import { createContext } from 'react';
import { IGlobalSummary } from '../interfaces/IGlobalSummary';
import { globalSummaryDefault } from '../util/util';

export const PlayContext = createContext({summary:globalSummaryDefault, updateValue:(newObj: IGlobalSummary)=>{}});