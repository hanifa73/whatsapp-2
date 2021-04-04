import Head from 'next/head'
import Sidebar from '../components/Sidebar'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>whatsapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
           <Sidebar/>
    </div>
  )
}
