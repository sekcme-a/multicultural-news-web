import { useRouter } from "next/router";
import React from "react"
import useAuth from "src/hook/auth/auth"
import { firestore as db } from "firebase/firebase";
//로그인이 되어있다면 세팅으로 이동
export function withPublic(Component) {
  return function WithPublic(props){
    const auth = useAuth();
    const router = useRouter();
    const pathname = router.pathname;
    // const haveData = await db.collection("users").doc(auth.user.uid).get()
    const haveData = 0;
    if (auth.user!==null) {
      console.log(auth.user.providerData)
      db.collection("users").doc(auth.user.uid).get().then((doc) => {
        if (!doc.exists && auth.user) {
            let photoURL = "https://firebasestorage.googleapis.com/v0/b/multicultural-news-web.appspot.com/o/profile%2FvB2S4XriW1RFbt21u078FI8va6D2?alt=media&token=728fe9e8-ae4e-41d1-b9c4-f26ee84f19f2"
            let displayName = `사용자${auth.user.uid.substr(1,5)}`
          if (auth.user.photoURL)
            photoURL = auth.user.photoURL
          if(auth.user.displayName)
            displayName = auth.user.displayName
          db.collection("users").doc(auth.user.uid).set({
            roles: ["user"], name: displayName, photo: photoURL,
            phoneNumber: auth.user.phoneNumber, email: auth.user.email, emailVerified: auth.user.emailVerified,
            importance: 5, bookmark: [], like: [], isSoundOn:true, isBreakingNewsOn: true, providerId : auth.user.providerData[0].providerId
          })
          router.replace("/setting")
          return <div></div>
        } else if (auth.user) {
          router.replace("/setting")
          return <div></div>
        }
      })
    }
    return <Component auth={auth} pathname={pathname} {...props} />
  }
}

//로그인이 안되있다면 로그인으로 이동.
export function withProtected(Component) {
  return function WithProtected(props){
    const auth = useAuth();
    const router = useRouter();
    const pathname = router.pathname;

    if (!auth.user) {
      router.replace("/login")
      return <div></div>
    }
    return <Component auth={auth} pathname={pathname} {...props} />
  }
}