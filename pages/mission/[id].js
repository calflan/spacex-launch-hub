import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../../styles/subPage.module.css";

export default function Review({ mission }) {
  return (
    <div key={mission.id} className={styles.container}>
      <h1 className={styles.title}>{mission.name}</h1>
      <h2 className={styles.description}>{mission.website}</h2>
      <p>{mission.description}</p>
    </div>
  );
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetMissions {
        missions {
          id
        }
      }
    `,
  });

  const paths = data.missions.map((mission) => ({
    params: { id: mission.id },
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
      query GetMission {
        mission(id: "${params.id}") {
          description
          id
          name
          website
        }
      }
    `,
  });

  return {
    props: {
      mission: data.mission,
    },
  };
}
