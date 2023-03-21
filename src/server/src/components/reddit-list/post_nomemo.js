import React from "react"
import Truncate from "react-truncate"
import * as styles from "./reddit-list.module.scss"

const Post = ({ post, removePost, addTag }) => {
  const tags = () => {
    return post.tags.map((tag, index) => <div key={index}>{tag}</div>)
  }
  const removePostThis = e => {
    removePost(post.id)
  }
  const addTagThis = e => {
    if (e.key === "Enter") {
      addTag(post.id, e.target.value)
      e.target.value = ""
    }
  }
  return (
    <div className={`${styles.post}`}>
      <a
        href={post.url ? post.url : `https://reddit.com/${post.permalink}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={removePostThis}
      >
        <h2>
          <Truncate lines={2}>
            {!post.parent_id && post.title !== ""
              ? post.title
              : `Reddit Comment on - ${post.link_title}`}
          </Truncate>
        </h2>
        <p>
          <Truncate lines={6}>
            {post.selftext_html && (
              <span dangerouslySetInnerHTML={{ __html: post.selftext_html }} />
            )}
          </Truncate>
        </p>
      </a>
      <input type="text" className={styles.taginput} onKeyPress={addTagThis} />
      {tags()}
    </div>
  )
}

export default Post
