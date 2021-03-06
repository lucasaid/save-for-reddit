import { Link } from "gatsby"
import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RedditListTrash from "../components/reddit-list/trash"
import styles from "./page.module.scss"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <RedditListTrash />
  </Layout>
)

export default IndexPage
