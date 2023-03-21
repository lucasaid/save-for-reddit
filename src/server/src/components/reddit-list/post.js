import React from "react"
import Truncate from "react-truncate"
import axios from "axios"
import * as styles from "./reddit-list.module.scss"

class Post extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tagOpen: false,
    }
    this.taginput = React.createRef()
    this.addTag = this.addTag.bind(this)
  }
  tags = () => {
    return this.props.post.tags.map((tag, index) => (
      <div className={styles.tag} key={index}>
        {tag}
      </div>
    ))
  }
  removePost = e => {
    e.preventDefault()
    let endpoint = "deletePost"
    if (this.props.post.delete) {
      endpoint = "restorePost"
    }
    axios
      .put(`http://localhost:3000/${endpoint}/${this.props.post.id}`)
      .then(res => {
        this.props.update()
      })
  }

  addTag = e => {
    if (e.key === "Enter") {
      axios
        .put(`http://localhost:3000/addTag/${this.props.post.id}`, {
          tag: e.target.value,
        })
        .then(res => {
          this.setState({
            tagOpen: false,
          })
          this.props.update()
        })
      e.target.value = ""
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
          {this.props.post.preview && this.props.post.preview.images[0] && this.props.post.preview.images[0].resolutions[2] && <img src={this.props.post.preview.images[0].resolutions[2].url} />}
        </a>
        {this.state.tagOpen && (
          <div className={styles.taginputwrapper}>
            <span>Add Tag</span>
            <input
              type="text"
              ref={this.taginput}
              className={styles.taginput}
              onKeyPress={this.addTag}
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
        <div className={styles.removebar}>
          <a
            href="#sendtotrash"
            onClick={this.removePost}
            className={styles.trash}
          >
            {this.props.post.delete ? `restore` : `remove`}
          </a>
        </div>
      </div>
    )
  }
}

export default Post
