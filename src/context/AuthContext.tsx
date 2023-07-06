/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, createContext } from "react";

export const AuthContext = createContext({
    uid: "",
    username: "",
    setNewUser: (_uid: string, _username: string) => { },
    clearUser: () => { }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContextProvider = (props: any) => {
    const [uid, setUid] = useState("");
    const [username, setUsername] = useState<string>("");

    const setUser = (newUid: string, newUsername: string) => {
        setUid(newUid);
        setUsername(newUsername);
    }

    const clearUser = () => {
        setUid("");
        setUsername("")
    }

    const context = {
        uid: uid,
        username: username,
        setNewUser: setUser,
        clearUser: clearUser
    }

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;