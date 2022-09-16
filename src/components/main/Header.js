import React, {useEffect, useState, useRef} from "react"
import styles from "styles/main/header.module.css"
import Image from "next/image"
import logo from "public/logo.png"
import Link from "next/link"
import SearchIcon from '@mui/icons-material/Search';
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"

const Header = (props) => {
  const [isSearchClick, setIsSearchClick] = useState(false)
  const [categoryList, setCategoryList] = useState([""])
  const [localList, setLocalList] = useState([""])
  const [countryList, setCountryList] = useState([""])
  const [societyList, setSocietyList] = useState([""])
  const [cultureList, setCultureList] = useState([""])
  const [planList, setPlanList] = useState([""])
  // const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const onSearchContainerClick = () => {
    router.push('/search')
  }

  useEffect(() => {
    // let temp = []
    // db.collection("category").doc("list").get().then((doc) => {
    //   for (let i = 0; i < doc.data().list.length; i++){
    //     temp.push({ name:doc.data().list[i], id: doc.data().idList[i]})
    //   }
    //   setCategoryList(temp)
    // })
    let temp2=[]
    db.collection("local").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp2.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setLocalList(temp2)
    })
    let temp3=[]
    db.collection("country").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp3.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setCountryList(temp3)
    })
    let temp4=[]
    db.collection("society").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp4.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setSocietyList(temp4)
    })
    let temp5=[]
    db.collection("culture").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp5.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setCultureList(temp5)
    })
    let temp6=[]
    db.collection("plan").doc("list").get().then((doc) => {
      for (let i = 0; i < doc.data().list.length; i++){
        temp6.push({ name:doc.data().list[i], id: doc.data().idList[i]})
      }
      setPlanList(temp6)
    })
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <></>
    )
  }
  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo_search_container}>
          <Link href="/" passHref scroll={false}>
            <a><Image src={logo} width={200} height={36} layout="fixed" priority/></a>
          </Link>
          <div className={styles.search_container} onClick={onSearchContainerClick}>
            <SearchIcon sx={{fontSize: 18}} />
          </div>
        </div>
        <ul className={styles.menu_container}>
          <li className={styles.menu_items}>
            <Link href={'/'} passHref scroll={false}>
              <a>
                <p className={router.pathname==='/' ? styles.selected : undefined}>메인</p>
                <div className={router.pathname==='/' ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          <li className={styles.menu_items}>
            <Link href={`/local/${localList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("local")  ? styles.selected : undefined}>지역별</p>
                <div className={router.pathname.includes("local") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          <li className={styles.menu_items}>
            <Link href={`/country/${countryList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("country") ? styles.selected : undefined}>언어별</p>
                <div className={router.pathname.includes("country") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          <li className={styles.menu_items}>
            <Link href={`/society/${societyList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("society") ? styles.selected : undefined}>사회</p>
                <div className={router.pathname.includes("society") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          <li className={styles.menu_items}>
            <Link href={`/culture/${cultureList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("culture") ? styles.selected : undefined}>문화</p>
                <div className={router.pathname.includes("culture") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          <li className={styles.menu_items}>
            <Link href={`/plan/${planList[0].id}`} passHref scroll={false}>
              <a>
                <p className={router.pathname.includes("plan") ? styles.selected : undefined}>기획</p>
                <div className={router.pathname.includes("plan") ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
              </a>
            </Link>
          </li>
          {/* {categoryList?.map((category,index) => {
            return (
              <li key={index} className={styles.menu_items}>
                <Link href={`/category/${category.id}`} passHref scroll={false}>
                  <a>
                    <p className={router.query.slug===category.id ? styles.selected : undefined}>{category.name}</p>
                    <div className={router.query.slug===category.id ? `${styles.selected} ${styles.selected_item}`:styles.selected_item}></div>
                  </a>
                </Link>
              </li>
            )
          })} */}
        </ul>
      </div>
      {/* {router.pathname.includes("local")&&
        <ul className={styles.sub_header_container}>
          {localList?.map((local,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/local/${local.id}`} passHref>
                  <a>
                    <p className={router.query.slug===local.id ? styles.sub_selected : undefined}>{local.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      } */}
      {router.pathname.includes("country")&&
        <ul className={styles.sub_header_container}>
          {countryList?.map((country,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/country/${country.id}`} passHref>
                  <a>
                    <p className={router.query.slug===country.id ? styles.sub_selected : undefined}>{country.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      }
      {router.pathname.includes("local")&&
        <ul className={styles.sub_header_container}>
          {localList?.map((local,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/local/${local.id}`} passHref>
                  <a>
                    <p className={router.query.slug===local.id ? styles.sub_selected : undefined}>{local.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      }
      {router.pathname.includes("society")&&
        <ul className={styles.sub_header_container}>
          {societyList?.map((society,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/society/${society.id}`} passHref>
                  <a>
                    <p className={router.query.slug===society.id ? styles.sub_selected : undefined}>{society.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      }
      {router.pathname.includes("culture")&&
        <ul className={styles.sub_header_container}>
          {cultureList?.map((culture,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/culture/${culture.id}`} passHref>
                  <a>
                    <p className={router.query.slug===culture.id ? styles.sub_selected : undefined}>{culture.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      }
      {router.pathname.includes("plan")&&
        <ul className={styles.sub_header_container}>
          {planList?.map((plan,index) => {
            return (
              <li key={index} className={styles.sub_menu_items}>
                <Link href={`/plan/${plan.id}`} passHref>
                  <a>
                    <p className={router.query.slug===plan.id ? styles.sub_selected : undefined}>{plan.name}</p>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      }
    </>
  )
}
export default Header