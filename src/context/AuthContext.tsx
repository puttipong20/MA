/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, createContext } from "react";

import { UserDetail } from "../types/Type";

export const AuthContext = createContext({
    uid: "",
    detail: { role: "", company: "" } as UserDetail,
    setNewUser: (_uid: string, _detail: UserDetail) => { },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContextProvider = (props: any) => {
    const [uid, setUid] = useState("");
    const [userDetail, setUserDetail] = useState<UserDetail>({ role: "", company: "" });

    const setUser = (newUid: string, newUserDetail: UserDetail) => {
        setUid(newUid);
        setUserDetail(newUserDetail);
    }

    const context = {
        uid: uid,
        detail: userDetail,
        setNewUser: setUser
    }

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;