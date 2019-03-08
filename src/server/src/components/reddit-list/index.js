import React from "react"
import axios from "axios"
import LazyLoad from "react-lazyload"
import { debounce } from "throttle-debounce"
import Post from "./post"

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
    this.removePost = this.removePost.bind(this)
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
    console.log("search")
    this.setState(
      {
        search: e.target.value,
      },
      () => {
        this.filterResultsThrottled()
      }
    )
  }
  removePost = id => {
    axios.delete(`http://localhost:3000/deletePost/${id}`).then(res => {
      this.update()
    })
  }

  addTag = (id, value) => {
    axios
      .put(`http://localhost:3000/addTag/${id}`, {
        tag: value,
      })
      .then(res => {
        this.update()
      })
  }
  renderData() {
    return this.state.filtered.map(
      (item, index) =>
        Object.keys(item).length > 0 && (
          <LazyLoad height={200} offset={100}>
            <Post
              key={index}
              post={item}
              removePost={this.removePost}
              addTag={this.addTag}
            />
          </LazyLoad>
        )
    )
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.search} />
        {this.renderData()}
      </div>
    )
  }
}

export default RedditList
