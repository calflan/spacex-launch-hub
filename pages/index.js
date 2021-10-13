import Head from "next/head";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";

export default function Home({ launches, missions, histories }) {
  return (
    <div>
      <Head>
        <title>SpaceX Launches</title>
        <meta
          name="description"
          content="Launch and mission details for SpaceX"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.heading}>
          <h1 className={styles.title}>SpaceX Launches</h1>
          <p className={styles.description}>
            Launch and mission details for SpaceX
          </p>
        </div>

        <div className={styles.grids}>
          <div className={styles.launches}>
            <p className={styles.description}>Recent launches</p>
            <div className={styles.grid}>
              {launches.map((launch) => {
                return (
                  <a
                    key={launch.id}
                    href={`/launch/${launch.id}`}
                    className={styles.card}
                  >
                    <h2>{launch.mission_name}</h2>
                    <p>{launch.rocket.rocket_name}</p>
                    <p>
                      {new Date(launch.launch_date_local).toLocaleDateString(
                        "en-UK"
                      )}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>

          <div className={styles.missions}>
            <p className={styles.description}>Recent missions</p>
            <div className={styles.grid}>
              {missions.map((mission) => {
                return (
                  <a
                    key={mission.id}
                    href={mission.website}
                    className={styles.card}
                  >
                    <h2>{mission.name}</h2>
                    <p>{mission.website}</p>
                  </a>
                );
              })}
            </div>
          </div>

          <div className={styles.news}>
            <p className={styles.description}>News</p>

            <div className={styles.grid}>
              {histories.map((history) => {
                return (
                  <a
                    key={history.id}
                    href={history.links.article}
                    className={styles.card}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h2>{history.title}</h2>
                    <p>{history.details}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 4) {
          id
          mission_name
          launch_date_local
          rocket {
            rocket_name
          }
        }
        missions(limit: 4) {
          id
          name
          website
        }
        histories(limit: 4) {
          id
          details
          title
          links {
            article
          }
        }
      }
    `,
  });

  return {
    props: {
      launches: data.launchesPast,
      missions: data.missions,
      histories: data.histories,
    },
  };
}
