import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import useAuth from 'src/hook/auth/auth'
import Loader from "src/components/public/Loader"
import style from "styles/admin/slug.module.css"
import AdminNavbar from "components/admin/AdminNavbar"
import { adminMenuItems } from "data/adminMenuItems"
import { firestore } from "firebase/firebase"

import NewArticle from "components/admin/NewArticle"
import EditArticle from "components/admin/EditArticle"
import Setting from "src/components/admin/Setting"
import Recommand from "src/components/admin/Recommand"
import NewAnnouncement from "src/components/admin/NewAnnouncement"
import EditAnnouncement from "src/components/admin/EditAnnouncement"
import AppInfo from "src/components/admin/AppInfo"
import Help from "src/components/admin/Help"
import DataInfo from "src/components/admin/DataInfo"
import Crawling from "src/components/admin/Crawling"

const Admin = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user, userrole, setUserrole, logout } = useAuth();
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      firestore.collection("users").doc(user.uid).get().then((doc) => {
        setUserrole(doc.data()?.roles)
      })
    }
  }, [user])


  useEffect(() => {
    adminMenuItems.forEach((item) => {
      if (item.child === false) {
        if (item.type === "sub" && item.path === `/${slug}`)
          setTitle(item.subtitle)
        if (item.type === "main" && item.path === `/${slug}`)
          setTitle(item.title)
      }
    })
  }, [slug])

  const noAuthority = () => {
    return (
      <div className={style.notAdminContainer}>
        <h2>관리자 권한이 없습니다.</h2>
        <h3>관리자가 관리자 권한을 부여해야합니다.</h3>
        <h4>권한을 부여해야하는 관리자 uid : {`${user.uid}`}</h4>
      </div>
    )
  }
  if (user && userrole === null)
    return <Loader />

  if (!user)
    return <h1>로그인 되어있지 않음</h1>
    
  if (!userrole?.includes("admin"))
    return noAuthority()
  
  return (
    <div className={style.adminBackground}>
      {console.log(userrole)}
      <div className={style.bg}>
        <div className={style.navbarContainer}>
          <div className={style.navbarContainer2}>
            <AdminNavbar userrole={userrole} />
          </div>
        </div>
        <div className={style.contentContainer}>
          <div className={style.headerContainer}>
            <p>{title}</p>
          </div>
          {slug === "newArticle" &&  <NewArticle />}
          {slug === "editArticle" &&  <EditArticle />}
          {slug === "local" &&  <Setting loc="local" />}
          {slug === "country" &&  <Setting loc="country" />}
          {slug === "society" &&  <Setting loc="society" />}
          {slug === "culture" &&  <Setting loc="culture" />}
          {slug === "plan" &&  <Setting loc="plan" />}
          {slug === "appInfo" &&  <AppInfo />}
          {slug === "recommand" && <Recommand />}
          {slug === "newAnnouncement" && <NewAnnouncement />}
          {slug === "editAnnouncement" && <EditAnnouncement />}
          {slug === "help" && <Help />}
          {slug === "dataInfo" && <DataInfo />}
          {slug === "crawling" && <Crawling />}
        </div>
      </div>
    </div>
  )
}

export default Admin;