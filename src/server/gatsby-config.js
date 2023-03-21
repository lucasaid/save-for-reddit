module.exports = {
  siteMetadata: {
    title: `Save Organiser for Reddit`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@chriscre8s`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Oswald`,
          `Open Sans\:400,700`,
          'material icons',
        ],
        display: 'swap'
      }
    },
    `gatsby-plugin-sharp`,
  ],
}
