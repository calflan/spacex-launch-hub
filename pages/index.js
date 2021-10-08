import Head from "next/head";
import Image from "next/image";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";

export default function Home({ launches, missions }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <meta
          name="description"
          content="Launch details for past and upcoming SpaceX launches"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>

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
                <p>{launch.launch_date_local}</p>
              </a>
            );
          })}
        </div>

        <p className={styles.description}>Recent missions</p>

        <div className={styles.grid}>
          {missions.map((mission) => {
            return (
              <a
                key={mission.id}
                href={`/mission/${mission.id}`}
                className={styles.card}
              >
                <h2>{mission.name}</h2>
                <p>{mission.website}</p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/calflan/spacex-launch-hub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>
            <Image
              src="/githubLogo.svg"
              alt="Github Logo"
              width={72}
              height={16}
            />
          </span>
        </a>
      </footer>
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
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
        missions {
          id
          name
          website
        }
      }
    `,
  });

  return {
    props: {
      launches: data.launchesPast,
      missions: data.missions,
    },
  };
}
