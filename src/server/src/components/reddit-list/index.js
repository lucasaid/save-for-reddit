import { Link } from "gatsby"
import React from "react"
import axios from "axios"
import LazyLoad from "react-lazyload"
import { debounce } from "throttle-debounce"
import Post from "./post"
import styles from "./reddit-list.module.scss"

class RedditList extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      filtered: [],
      search: "",
    }
    this.renderData = this.renderData.bind(this)
    this.search = this.search.bind(this)
    this.update = this.update.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.filterResultsThrottled = debounce(500, this.autocompleteSearch)
  }
  componentDidMount() {
    this.update()
  }
  update() {
    axios.get("http://localhost:3000/").then(res => {
      this.setState(
        {
          data: res.data,
          filtered: res.data,
        },
        () => {
          this.filterResults()
        }
      )
    })
  }
  autocompleteSearch = () => {
    this.filterResults()
  }
  filterResults = () => {
    if (this.state.search && this.state.search !== "") {
      console.log("Filtering")
      let filtered = this.state.data.filter(item => {
        if (Object.keys(item).length > 0) {
          let incat = item.tags.some(tag => {
            return (
              tag.toLowerCase().search(this.state.search.toLowerCase()) >= 0
            )
          })
          return (
            item.title.toLowerCase().search(this.state.search.toLowerCase()) >=
              0 || incat
          )
        }
        return false
      })
      this.setState({
        filtered,
      })
    } else {
      this.setState({
        filtered: this.state.data,
      })
    }
  }
  search(e) {
    this.setState(
      {
        search: e.target.value,
      },
      () => {
        this.filterResultsThrottled()
      }
    )
  }
  renderData() {
    return this.state.filtered.map(
      (item, index) =>
        Object.keys(item).length > 0 &&
        (!item.delete && (
          <LazyLoad key={index} height={200} offset={100}>
            <Post post={item} update={this.update} />
          </LazyLoad>
        ))
    )
  }
  renderHeader() {
    const postLength = this.state.filtered.reduce((count, current) => {
      if (!current.delete) {
        return count + 1
      }
      return count
    }, 0)
    return (
      <div className={styles.header}>
        {postLength} Posts
        <Link to={`/trash`} className={styles.headerlink}>
          View Trash
        </Link>
      </div>
    )
  }
  render() {
    return (
      <div>
        {this.renderHeader()}
        <input type="text" onChange={this.search} />
        {this.renderData()}
      </div>
    )
  }
}

export default RedditList
