import Head from "next/head";
import "@/styles/globals.css";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <>
      <Head>
        <title>{`${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="description" content={`${process.env.NEXT_PUBLIC_WEBSITE_NAME} is an Online Community App.`} />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar logout={logout} />
      <Component {...pageProps} />
    </>
  );
}
