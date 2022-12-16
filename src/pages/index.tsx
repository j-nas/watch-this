import { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"
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
          <p>you are logged in as {session.data?.user?.name}</p>
          <h1 className="mb-2 text-6xl">Watch This!</h1>
        </div>
        <div>
          {!session.data ? (
            <>
              <button
                type="button"
                className="m-2 rounded-lg bg-purple-900 p-2"
                onClick={() => signIn("discord")}
              >
                Log in with discord
              </button>
              <button
                type="button"
                className="m-2 rounded-lg bg-purple-900 p-2"
                onClick={() => signIn()}
              >
                Log in credentials
              </button>
            </>
          ) : (
            <button
              onClick={() => signOut()}
              type="button"
              className="rounded-lg bg-purple-900 p-2"
            >
              Log out
            </button>
          )}
        </div>
        <MovieSearch />
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

const MovieSearch = () => {
  const [movieSearch, setMovieSearch] = useState("")
  const result = trpc.movieDb.searchMovies.useMutation()
  console.log(result)
  const searchMovies = () => {
    result.mutate({ query: movieSearch, page: 1 })
    console.log(result.data)
  }
  return (
    <div className="flex flex-col">
      <div>
        <label htmlFor="movieSearch">
          Search for a movie
          <input
            className="m-2 rounded-lg bg-white p-1 text-black focus:outline-none"
            type="text"
            value={movieSearch}
            onChange={(e) => setMovieSearch(e.target.value)}
          />
        </label>
        <button
          className="m-2 rounded-lg bg-white p-1 text-black"
          onClick={searchMovies}
        >
          Search
        </button>
      </div>
      <div>{!result.data && <PopularMovies />}</div>
      {result.data && (
        <div>
          {result.data.results.map((movie) => (
            <div key={movie.id}>{movie.title}</div>
          ))}
        </div>
      )}
    </div>
  )
}

const PopularMovies = () => {
  const popularMovies = trpc.movieDb.getPopularMovies.useQuery({ page: 1 })
  const { data: movies } = popularMovies
  if (!movies) return <p>Loading...</p>
  return (
    <div>
      {movies.results.map((movie) => (
        <div className="max-w-screen-sm">
          <h4>{movie.title}</h4>
        </div>
      ))}
    </div>
  )
}

// const MovieInfo = ({tmdbId}) => {
//   const movie = trpc.movieDb.getMovieInfo.useQuery(tmdbId)

//   return (
//     <div>
//       <h4>{movie.data?.title}</h4>
//       <p>{movie.data?.overview}</p>
//     </div>
//   )
// }

export default Home
