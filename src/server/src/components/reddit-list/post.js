import React from "react"
import Truncate from "react-truncate"
import styles from "./reddit-list.module.scss"

class Post extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tagOpen: false,
    }
    this.taginput = React.createRef()
  }
  tags = () => {
    return this.props.post.tags.map((tag, index) => (
      <div className={styles.tag} key={index}>
        {tag}
      </div>
    ))
  }
  // const removePostThis = e => {
  //   removePost(post.id)
  // }
  addTagThis = e => {
    if (e.key === "Enter") {
      this.props.addTag(this.props.post.id, e.target.value)
      e.target.value = ""
      this.setState({
        tagOpen: false,
      })
    }
  }
  showTagInput = e => {
    e.preventDefault()
    this.setState(
      {
        tagOpen: !this.state.tagOpen,
      },
      () => {
        if (this.taginput.current) {
          console.log(this.taginput.current)
          this.taginput.current.focus()
        }
      }
    )
  }
  render() {
    return (
      <div className={`${styles.post}`}>
        <a
          href={
            this.props.post.url
              ? this.props.post.url
              : `https://reddit.com/${this.props.post.permalink}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            <Truncate lines={2}>
              {!this.props.post.parent_id && this.props.post.title !== ""
                ? this.props.post.title
                : `Reddit Comment on - ${this.props.post.link_title}`}
            </Truncate>
          </h2>
          <p>
            <Truncate lines={6}>
              {this.props.post.selftext_html && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: this.props.post.selftext_html,
                  }}
                />
              )}
            </Truncate>
          </p>
        </a>
        {this.state.tagOpen && (
          <div className={styles.taginputwrapper}>
            <span>Add Tag</span>
            <input
              type="text"
              ref={this.taginput}
              className={styles.taginput}
              onKeyPress={this.addTagThis}
            />
          </div>
        )}
        <div className={styles.tags}>
          {this.tags()}
          <a
            href="#showtaginput"
            onClick={this.showTagInput}
            className={styles.addtag}
          >
            {this.state.tagOpen ? `-` : `+`}
          </a>
        </div>
      </div>
    )
  }
}

export default Post
