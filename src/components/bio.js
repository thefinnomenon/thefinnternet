/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import profilePic from "../../content/assets/profile-pic.jpg"

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <img
              src={profilePic}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                width: rhythm(3),
                height: rhythm(3),
                borderRadius: "50%",
              }}
            />
            <p>
              Personal blog by <strong>{author}</strong>.
              <br />
              Musings and write-ups about coding stuff.
              <br />
              <a
                href={`https://github.com/${social.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Checkout his work on github
              </a>
              <span> & </span>
              <a href={`mailto:${social.email}`}>get in touch</a>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        social {
          github
          email
        }
      }
    }
  }
`

export default Bio
