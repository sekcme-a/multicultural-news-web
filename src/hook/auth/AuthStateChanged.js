import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useAuth from "src/hook/auth/auth";
import { firestore as db } from "firebase/firebase";


export default function AuthStateChanged({ children }) {
  const { setUser, setUserrole } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user !== null) {
        db.collection("users").doc(user.uid).get().then((doc) => {
          if (doc.exists)
            setUserrole(doc.data()?.roles)
        })
      }
      setIsLoading(false)
    })
    //eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <div></div>
  }

  return children;
}