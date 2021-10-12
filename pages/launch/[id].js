import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../../styles/subPage.module.css";
import ReactPlayer from "react-player";
import React from "react";

export default function Launch({ launch }) {
  return (
    <React.Fragment>
      <ReactPlayer
        stopOnUnmount
        light
        url={launch?.links?.video_link}
        width="100%"
        height="50vh"
      />
      <div key={launch.id} className={styles.container}>
        <h1 className={styles.title}>
          {launch.mission_name} - {launch.launch_year}
        </h1>
        {launch.rocket.rocket_name && (
          <p className={styles.description}>
            Rocket: {launch.rocket.rocket_name}
          </p>
        )}
        {launch.details && <p>{launch.details}</p>}
      </div>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 4) {
          id
        }
      }
    `,
  });

  const paths = data.launchesPast.map((launch) => ({
    params: { id: launch.id },
  }));

  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunch {
        launch(id: ${params.id}) {
          id
          details
          launch_year
          mission_name
          rocket {
            rocket_name
          }
          links {
            video_link
          }
        }
      }
    `,
  });

  return {
    props: {
      launch: data.launch,
    },
  };
}
