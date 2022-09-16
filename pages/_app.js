import '../styles/globals.css'
import '../styles/card.css'
import { AuthProvider } from "src/hook/auth/auth"
import AuthStateChanged from 'src/hook/auth/AuthStateChanged'
import React, { useEffect, useState, useCallback, useRef } from "react"
import Header from "src/components/main/Header"
import Footer from "src/components/main/Footer"
import { useRouter } from "next/router"
import { BookmarkLikeProvider } from 'src/hook/bookmarkLike'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [isHideHeaderUrl, setIsHideHeaderUrl] = useState(false)

  //특정 url들에서 header를 가리기 위함
  useEffect(() => {
    if (router.pathname.includes("/setting") || router.pathname.includes("/signin") || router.pathname.includes("/findpassword") || router.pathname.includes("/login") || router.pathname.includes("/notification")
      || router.pathname.includes("/search") || router.pathname.includes("/result")) 
      setIsHideHeaderUrl(true)
    else if (router.pathname.includes("/post")) {
      setIsHideHeaderUrl(true)
    }
    else {
      setIsHideHeaderUrl(false)
    }
    if (!router.pathname.includes("/search") || !router.pathname.includes("/post")){
      if (window) {
        window.sessionStorage.setItem("input", null)
      }
    }
  }, [router.pathname])

  return (
    <AuthProvider>
      <AuthStateChanged>
        <BookmarkLikeProvider>
          {isHideHeaderUrl ?
            <>
              <Component {...pageProps} />
            </>
            :
            <>
              <Header />
              <div className="body_container">
                <Component {...pageProps} />
              </div>
            </>
          }
          {!router.pathname.includes("rhksflwk") && <Footer />}
        </BookmarkLikeProvider>
      </AuthStateChanged>
    </AuthProvider>
  )
}

export default MyApp