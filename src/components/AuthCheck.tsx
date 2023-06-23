/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "../services/config-db";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthCheck = async (Auth:any,navigate:any) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDetail = await getDoc(doc(db, "Profiles", user.uid))
            if (userDetail.exists()) {
                Auth.setNewUser(user.uid, userDetail.data())
            } else {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    })
}

export default AuthCheck;