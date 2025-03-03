import React from 'react'
import { createContext, useState } from 'react'

export const UserContext = createContext(null)

export function UserContextProvider({children}) {
    
    const [userInfo,setUserInfo] = useState(null)

    return (
        <UserContext.Provider value={{userInfo,setUserInfo}}>
          {children}
        </UserContext.Provider>
  );
}
