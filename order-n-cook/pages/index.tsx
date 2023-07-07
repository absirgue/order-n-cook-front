import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Order n'Cook</title>
        <meta name="description" content="Cuisinez, on s'occupe du reste" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
     
    </>
  )
}
