import { createContext } from 'react';
import { ISummary } from '../interfaces/ISummary';

export const PlayContext = createContext({summary:{ok:0, bad:0}, updateValue:(newObj: ISummary)=>{}});