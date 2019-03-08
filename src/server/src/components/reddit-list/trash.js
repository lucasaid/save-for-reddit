import React from "react"
import RedditList from "./index"
import Post from "./post"
import LazyLoad from "react-lazyload"

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
}

export default RedditListTrash
