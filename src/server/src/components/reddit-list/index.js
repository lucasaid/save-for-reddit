import React from "react"
import axios from "axios"
import Post from "./post"

class RedditList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      filtered: [],
    }
    this.renderData = this.renderData.bind(this)

    this.search = this.search.bind(this)
    this.removePost = this.removePost.bind(this)
    this.update = this.update.bind(this)
  }
  componentDidMount() {
    this.update()
  }
  update() {
    axios.get("http://localhost:3000/").then(res => {
      this.setState({
        data: res.data,
        filtered: res.data,
      })
    })
  }
  search(e) {
    let filtered = this.state.data.filter(item => {
      if (Object.keys(item).length > 0) {
        let incat = item.categories.some(category => {
          return (
            category.toLowerCase().search(e.target.value.toLowerCase()) >= 0
          )
        })
        return (
          item.title.toLowerCase().search(e.target.value.toLowerCase()) >= 0 ||
          incat
        )
      }
      return false
    })
    this.setState({
      filtered,
    })
  }
  removePost = id => {
    axios.delete(`http://localhost:3000/deletePost/${id}`).then(res => {
      this.update()
    })
  }

  addCategory = (id, value) => {
    axios
      .put(`http://localhost:3000/addCategory/${id}`, {
        category: value,
      })
      .then(res => {
        this.update()
      })
  }
  renderData() {
    return this.state.filtered.map(
      (item, index) =>
        Object.keys(item).length > 0 && (
          <Post
            key={index}
            post={item}
            removePost={this.removePost}
            addCategory={this.addCategory}
          />
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
