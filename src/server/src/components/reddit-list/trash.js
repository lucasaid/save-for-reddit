import { Link } from "gatsby"
import React from "react"
import RedditList from "./index"
import Post from "./post"
import LazyLoad from "react-lazyload"
import styles from "./reddit-list.module.scss"

class RedditListTrash extends RedditList {
  renderData() {
    return this.state.filtered.map(
      (item, index) =>
        Object.keys(item).length > 0 &&
        (item.delete && (
          <LazyLoad key={index} height={200} offset={100}>
            <Post post={item} update={this.update} />
          </LazyLoad>
        ))
    )
  }
  renderHeader() {
    const postLength = this.state.filtered.reduce((count, current) => {
      if (current.delete) {
        return count + 1
      }
      return count
    }, 0)
    return (
      <div className={styles.header}>
        {postLength} Posts
        <Link to={`/`} className={styles.headerlink}>
          Back
        </Link>
      </div>
    )
  }
}

export default RedditListTrash
