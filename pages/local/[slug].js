import React, {useEffect, useState} from "react"
import { useRouter } from "next/router";
import styles from "styles/category.module.css"
import PostList from "components/main/PostList"

const Category = (props) => {
  const router = useRouter();
  const { slug } = router.query

  return (      
    <>
      <PostList id={slug} addMargin={true}></PostList>
    </>
  )            
}
export default Category