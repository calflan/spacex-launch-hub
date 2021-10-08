import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../../styles/subPage.module.css";

export default function Launch({ launch }) {
  return (
    <div key={launch.id} className={styles.container}>
      <h1 className={styles.title}>{launch.mission_name}</h1>
      <p className={styles.description}>{launch.launch_year}</p>
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
      query GetLaunches {
        launchesPast(limit: 4) {
          id
        }
      }
    `,
  });

  console.log(data);

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
          launch_year
          mission_name
          rocket {
            rocket_name
            rocket_type
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
