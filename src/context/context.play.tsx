import { createContext, useState } from "react";
import { ISummary, ISummaryContext } from "../interfaces/ISummary";

const PlayContext = createContext<ISummaryContext>({summary:{ok:0, bad:0}, updateValue:(value:any)=>{}});

type MyProviderProps = {
    children: React.ReactNode;
  };

// create a provider component
export const PlayProvider2 = ({ children }: MyProviderProps) => {
    const [summary, setSummary] = useState({ok:0, bad:0});
  
    const updateValue = (newValue:ISummary) => {
        setSummary(newValue);
    };
  
    return (
      <PlayContext.Provider value={{summary, updateValue}}>
        {children}
      </PlayContext.Provider>
    );
  }

  