import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/router"
import PostList from "components/main/PostList"
import { sendRequest } from "pages/api/sendRequest"
import MainNews from "src/components/main/MainNews"

export default function Home() {
  const [scrollY, setScrollY] = useState()
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([{ text: "asdf" },{ text: "asdf" },{ text: "asdf" },{ text: "asdf" },{ text: "asdf" }])
  const [list, setList] = useState([])

  // const onScroll = useCallback(event => {
  //     const { pageYOffset, scrollY } = window;
  //     console.log("yOffset", pageYOffset, "scrollY", scrollY);
  //     setScrollY(window.pageYOffset);
  // }, []);

  // useEffect(() => {
  //   //add eventlistener to window
  //   window.addEventListener("scroll", onScroll, { passive: true });
  //   // remove event on unmount to prevent a memory leak
  //   () => window.removeEventListener("scroll", onScroll, { passive: true });
  // }, []);
  
//   const router = useRouter()

//   const getMorePost = () => {
//     // console.log("adsf")
//     setPosts([...posts,{ text: `asdf${count+1}` },{ text: `asdf${count+1}` },{ text: `asdf${count+1}` },{ text: `asdf${count+1}` },{ text: `asdf${count+1}` },])
//         setCount(count + 1)
//     console.log(count)
//   }

//   const onClick = () => {
//     getMorePost()
//   }

//   const onDivClick = () => {
//     if (window) {
//       window.sessionStorage.setItem("count",count)
//       window.sessionStorage.setItem("scrollPosition",scrollY)
//     }
//     router.push("/test")
//   }

//   useEffect(() => {
//     if (window) {
//       const num = window.sessionStorage.getItem("count")
//       setCount(parseInt(num))
//       fetchData(parseInt(num))
//       setTimeout(() => {
//       window.scrollTo(0, window.sessionStorage.getItem("scrollPosition"));
//       console.log(window.sessionStorage.getItem("scrollPosition"))
//       },100)
//     }
//   }, [])

// useEffect(() => {
//     window.addEventListener("beforeunload", refresh);
//     return () => {
//       window.removeEventListener("beforeunload", refresh);
//     };
//   }, []);
  
//   const refresh = () => {
//     window.sessionStorage.setItem("count", 0)
//   }

//   const fetchData = (n) => {
//     const temp = []
//     for (let i = 0; i <= n; i++){
//       temp = [...temp,{ text: `asdf${i}` },{ text: `asdf${i}` },{ text: `asdf${i}` },{ text: `asdf${i}` },{ text: `asdf${i}` }]
//     }
//     setPosts(temp)
//   }


//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//       // console.log(window.scrollY)
//     };
//     // handleScroll();

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

  return (
    <>
      <MainNews />
      <PostList id="home" addMargin={false}></PostList>
    </>
  )
}
