import { NextPage } from "next"
import Head from "next/head"
import { signIn, signOut, useSession } from "next-auth/react"
import { trpc } from "../utils/trpc"
const Home: NextPage = () => {
  const session = useSession()

  return (
    <>
      <Head>
        <title>Watch This!</title>
        <meta name="Viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <div className="r flex h-screen flex-col place-items-center bg-gradient-to-r from-zinc-800 to-purple-900 pt-24 text-zinc-300">
        <div>
          <h1 className="mb-2 text-6xl">Watch This!</h1>
          <form className="flex flex-col gap-1">
            <label>
              Name of list:
              <input className="ml-2 bg-zinc-700" type="text" />
            </label>
            <label className="">
              List:
              <input type="text" className="bg-zinc-700" />
            </label>
          </form>
        </div>
        <div>
          {session ? (
            <button type="button" className="m-2 rounded-lg bg-purple-900 p-2">
              Log in with discord
            </button>
          ) : (
            <button type="button" className="rounded-lg bg-purple-900 p-2">
              Log in with discord
            </button>
          )}
        </div>
        <MovieList />
      </div>
    </>
  )
}

const MovieList = () => {
  const list = trpc.movieList.getPublicMovieLists.useQuery()
  const { data: movieListList } = list
  if (!movieListList) return <p>Loading...</p>

  return (
    <div>
      {movieListList.map((l) => (
        <div>{l.title}</div>
      ))}
    </div>
  )
}

export default Home
