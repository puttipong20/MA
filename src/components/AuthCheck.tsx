/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "../services/config-db";
import { onAuthStateChanged } from "firebase/auth";

const AuthCheck = async (Auth: any, navigate: any) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            Auth.setNewUser(user.uid, user.displayName)
        } else {
            navigate("/login");
        }
    })
}

export default AuthCheck;