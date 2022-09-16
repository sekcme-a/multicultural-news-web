import { createContext, useState, useContext, useEffect } from "react"
import { firestore as db } from "firebase/firebase"

const bookmarkLikeContext = createContext()

export default function useBookmarkLike() {
  return useContext(bookmarkLikeContext)
}

export function BookmarkLikeProvider(props) {
  const [bookmarkList, setBookmarkList] = useState([])
  const [likeList, setLikeList] = useState([])
  const [triggerReload, setTriggerReload] = useState(true)

  const pushBookmark = (uid, id) => {
    // const temp = bookmarkList
    // temp.push(id)
    // setBookmarkList(temp)
    try {
      db.collection("users").doc(uid).get().then((doc) => {
        let list = doc.data().bookmark
        list.push(id)
        db.collection("users").doc(uid).update({ bookmark: list })
        setBookmarkList(list)
        setTriggerReload(!triggerReload)
      })
    } catch (e) {
      return false
    }
  }

  const deleteBookmark = (uid,id) => {
    const isId = (value) => {
      return value!==id
    }
    const temp = bookmarkList
    const temp2 = temp.filter(isId)
    console.log(id)
    console.log(temp)
    console.log(temp2)
    // console.log(temp2)
    setBookmarkList(temp2)
    try {
      db.collection("users").doc(uid).update({ bookmark: temp2 })
      setTriggerReload(!triggerReload)
      return true
    } catch (e) {
      return false
    }
  }

  const getBookmarkList = (uid) => {
    if (uid !== undefined) {
      db.collection("users").doc(uid).get().then((doc) => {
        setBookmarkList(doc.data().bookmark)
      })
    } 
  }

  const isBookmarked = (id) => {
    // console.log(bookmarkList)
    return bookmarkList.includes(id)
  }

  const pushLike = (uid, id) => {
    // const temp = likeList
    // temp.push(id)
    // setLikeList(temp)
    try {
      db.collection("users").doc(uid).get().then((doc) => {
        let list = doc.data().like
        list.push(id)
        db.collection("users").doc(uid).update({ like: list })
        setLikeList(list)
        setTriggerReload(!triggerReload)
      })
      return true
    } catch (e) {
      return false
    }
  }

  const deleteLike = (uid,id) => {
    const isId = (value) => {
      return value!==id
    }
    const temp = likeList
    const temp2 = temp.filter(isId)
    // console.log(temp2)
    setLikeList(temp2)
    try {
      db.collection("users").doc(uid).update({ like: temp2 })
      setTriggerReload(!triggerReload)
      return true
    } catch (e) {
      return false
    }
  }

  const getLikeList = async (uid) => {
    if (uid !== undefined) {
      db.collection("users").doc(uid).get().then((doc) => {
        setLikeList(doc.data().like)
      })
    } 
  }

  const isLiked = (id) => {
    // console.log(bookmarkList)
    return likeList.includes(id)
  }

  const value = {
    bookmarkList,
    likeList,
    triggerReload,
    pushBookmark,
    deleteBookmark,
    setBookmarkList,
    isBookmarked,
    getBookmarkList,
    pushLike,
    deleteLike,
    setLikeList,
    isLiked,
    getLikeList,
  }

  return <bookmarkLikeContext.Provider value={value} {...props} />
}