import React, { useState } from "react";
import style from "styles/admin/adminNavbar.module.css"
import Link from "next/link"
import { auth } from "firebase/firebase";
import Router ,{useRouter} from "next/router";
import ModeIcon from '@mui/icons-material/Mode';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LogoutIcon from '@mui/icons-material/Logout';
import { adminMenuItems } from "data/adminMenuItems"
import TagIcon from '@mui/icons-material/Tag';
import CampaignIcon from '@mui/icons-material/Campaign';
import PestControlIcon from '@mui/icons-material/PestControl';

const AdminNavbar = (props) => {
  const [clickedMain, setClickedMain] = useState("")

  const logoTitle = "한국다문화뉴스"
  const customUrl = "/rhksflwk"

  const onLogoutClick = () => {
    auth.signOut()
    Router.push("/")
  }

  const onMainItemClick = (title) => {
    if (title!==clickedMain)
      setClickedMain(title)
    else
      setClickedMain("")
  }

  const getIcon = (icon) => {
    if(icon==="ModeIcon")
      return <ModeIcon className={style.icon} />
    if(icon==="TagIcon")
      return <TagIcon className={style.icon} />
    if(icon==="CampaignIcon")
      return <CampaignIcon className={style.icon} />
    if (icon === "AdminPanelSettingsIcon")
      return <AdminPanelSettingsIcon className={style.icon} />
    if (icon === "PestControlIcon")
      return <PestControlIcon className={style.icon} />
  }

  const router = useRouter()
  const onItemClick = (url) => {
    if(url===window.location.pathname)
      router.reload(url)
    else 
      router.push(url)
  }
  return (
    <div className={style.container}>
      <div className={style.logo}>
        {logoTitle}
      </div>
      <ul className={style.itemContainer}>
        {props.userrole.includes("admin") && adminMenuItems.map((item, index) => {
          return (
            <>
              {(item.type === "main" && item.child === true) &&
                <li className={style.mainItem} onClick={() => onMainItemClick(item.title)} key={index}>
                  {getIcon(item.icon)}<p>{item.title}</p>{item.title===clickedMain ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                </li>
              }
              {(item.type === "main" && item.child===false)&&
                <Link href={`${customUrl}${item.path}`} key={index} >
                  <li className={style.mainItem} onClick={() => onMainItemClick(item.title)}>
                    {getIcon(item.icon)}<p>{item.title}</p>
                  </li>
                </Link>
              }
              {(item.type === "sub" && item.title===clickedMain) &&
                <li className={style.subItem} key={index} onClick={()=>onItemClick(`${customUrl}${item.path}`)}>
                  {item.subtitle}
                </li>
              }
            </>
          )
        })}
        {props.userrole==="author" && adminMenuItems.map((item, index) => {
          return (
            <>
              {(item.type === "main" && item.child === true && item.level==="author") &&
                <li className={style.mainItem} onClick={() => onMainItemClick(item.title)} key={index}>
                  {getIcon(item.icon)}<p>{item.title}</p>{item.title===clickedMain ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                </li>
              }
              {(item.type === "main" && item.child===false && item.level==="author")&&
                <Link href={`${customUrl}${item.path}`} key={index} >
                  <li className={style.mainItem} onClick={() => onMainItemClick(item.title)}>
                    {getIcon(item.icon)}<p>{item.title}</p>
                  </li>
                </Link>
              }
              {(item.type === "sub" && item.title===clickedMain && item.level==="author") &&
                <Link href={`${customUrl}${item.path}`} key={index} >
                  <li className={style.subItem} >
                    {item.subtitle}
                  </li>
                </Link>
              }
            </>
          )
        })}
        <li className={style.mainItem} onClick={onLogoutClick}>
          <LogoutIcon className={style.icon}/><p>로그아웃</p>
        </li>
      </ul>
    </div>
  )
}

export default AdminNavbar