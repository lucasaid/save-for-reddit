import React from "react"
import axios from "axios"
import styles from "./reddit-list.module.scss"

class RedditList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      filtered: [],
    }
    this.renderData = this.renderData.bind(this)
    this.search = this.search.bind(this)
  }
  componentDidMount() {
    axios.get("http://localhost:3000/").then(res => {
      console.log(res.data)
      this.setState({
        data: res.data,
        filtered: res.data,
      })
    })
  }
  search(e) {
    let filtered = this.state.data.filter(item => {
      if (Object.keys(item).length > 0) {
        return (
          item.title.toLowerCase().search(e.target.value.toLowerCase()) >= 0
        )
      }
      return false
    })
    this.setState({
      filtered,
    })
  }
  renderData() {
    return this.state.filtered.map(
      (item, index) =>
        Object.keys(item).length > 0 && (
          <div key={index} className={`${styles.post}`}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title !== "" ? item.title : item.selftext}
            </a>
          </div>
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
