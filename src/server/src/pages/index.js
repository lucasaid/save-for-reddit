import { Link } from "gatsby"
import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RedditList from "../components/reddit-list"
import styles from "./page.module.scss"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <RedditList />
  </Layout>
)

export default IndexPage
