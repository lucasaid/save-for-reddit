import React from "react"
import styles from "./reddit-list.module.scss"

const Post = ({ post, removePost, addCategory }) => {
  const categories = () => {
    return post.categories.map((category, index) => (
      <div key={index}>{category}</div>
    ))
  }
  const removePostThis = e => {
    removePost(post.id)
  }
  const addCategoryThis = e => {
    if (e.key === "Enter") {
      addCategory(post.id, e.target.value)
    }
  }
  return (
    <div className={`${styles.post}`}>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={removePostThis}
      >
        {post.delete ? "DELETED" : ""}
        {post.title !== "" ? post.title : post.selftext}
      </a>
      <input type="text" onKeyPress={addCategoryThis} />
      {categories()}
    </div>
  )
}

export default Post
