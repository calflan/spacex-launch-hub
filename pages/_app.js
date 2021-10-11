import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav>
        <Link href="/">🏠 Home</Link>
        <Link href="https://github.com/calflan/spacex-launch-hub">
          <a target="_blank">👨🏻‍💻 Code</a>
        </Link>
      </nav>
      <div className="main-container">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
