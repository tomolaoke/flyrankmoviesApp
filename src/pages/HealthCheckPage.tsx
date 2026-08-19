import { Button } from '../components/common/Button'
import { Spinner } from '../components/common/Spinner'
import { StatusButton } from '../components/common/StatusButton'
import { useAuthContext } from '../context/useAuthContext'
import { useHealthCheckViewModel } from '../viewmodels/useHealthCheckViewModel'

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90"><rect width="60" height="90" fill="%23374151"/></svg>'

/**
 * Diagnostic page for verifying the app's external dependencies are
 * reachable: required env vars are set, OMDb returns real search results,
 * Firestore is reachable, and what Firebase Auth currently reports.
 * Not linked from the main flows a typical visitor would use — intended
 * for developers verifying local/deploy setup.
 */
export function HealthCheckPage() {
  const { envVars, omdb, tmdb, firestore, isChecking, runChecks } = useHealthCheckViewModel()
  const { user, isLoading: isAuthLoading } = useAuthContext()

  const missingEnvVars = envVars.filter((v) => !v.present)

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Health Check</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Live status of this app's external dependencies.
            </p>
          </div>
          <Button variant="secondary" onClick={runChecks} isLoading={isChecking}>
            Re-run checks
          </Button>
        </div>

        {/* Environment variables */}
        <section
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="env-vars-heading"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="env-vars-heading" className="text-base font-semibold text-gray-900 dark:text-white">
              Environment variables
            </h2>
            <StatusButton
              status={missingEnvVars.length === 0 ? 'ok' : 'error'}
              label={missingEnvVars.length === 0 ? 'All set' : `${missingEnvVars.length} missing`}
              disabled
            />
          </div>
          <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
            {envVars.map((envVar) => (
              <li key={envVar.name} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span aria-hidden="true">{envVar.present ? '✅' : '❌'}</span>
                <code className="text-xs">{envVar.name}</code>
                <span className="sr-only">{envVar.present ? 'set' : 'not set'}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* OMDb API */}
        <section
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="omdb-heading"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="omdb-heading" className="text-base font-semibold text-gray-900 dark:text-white">
              OMDb API
            </h2>
            {omdb && (
              <StatusButton
                status={omdb.status === 'ok' ? 'ok' : 'error'}
                label={omdb.status === 'ok' ? 'Connected' : 'Failed'}
                disabled
              />
            )}
          </div>

          {isChecking && !omdb && <Spinner label="Checking OMDb" />}

          {omdb && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {omdb.message} <span className="text-gray-400 dark:text-gray-500">({omdb.latencyMs}ms)</span>
              </p>
              {omdb.sampleMovies.length > 0 && (
                <ul className="flex flex-wrap gap-3" aria-label="Sample fetched movies">
                  {omdb.sampleMovies.map((movie) => (
                    <li key={movie.imdbID} className="flex w-24 flex-col gap-1 text-center">
                      <img
                        src={movie.poster || FALLBACK_POSTER}
                        alt={`Poster for ${movie.title}`}
                        className="aspect-[2/3] w-full rounded object-cover"
                      />
                      <span className="truncate text-xs text-gray-700 dark:text-gray-300" title={movie.title}>
                        {movie.title}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{movie.year}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* TMDB API */}
        <section
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="tmdb-heading"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="tmdb-heading" className="text-base font-semibold text-gray-900 dark:text-white">
              TMDB API
            </h2>
            {tmdb && (
              <StatusButton
                status={tmdb.status === 'ok' ? 'ok' : 'error'}
                label={tmdb.status === 'ok' ? 'Connected' : 'Failed'}
                disabled
              />
            )}
          </div>

          {isChecking && !tmdb && <Spinner label="Checking TMDB" />}

          {tmdb && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tmdb.message} <span className="text-gray-400 dark:text-gray-500">({tmdb.latencyMs}ms)</span>
              </p>
              {tmdb.sampleMovies.length > 0 && (
                <ul className="flex flex-wrap gap-3" aria-label="Sample fetched movies">
                  {tmdb.sampleMovies.map((movie) => (
                    <li key={movie.imdbID} className="flex w-24 flex-col gap-1 text-center">
                      <img
                        src={movie.poster || FALLBACK_POSTER}
                        alt={`Poster for ${movie.title}`}
                        className="aspect-[2/3] w-full rounded object-cover"
                      />
                      <span className="truncate text-xs text-gray-700 dark:text-gray-300" title={movie.title}>
                        {movie.title}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{movie.year}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Firestore */}
        <section
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="firestore-heading"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="firestore-heading" className="text-base font-semibold text-gray-900 dark:text-white">
              Firestore
            </h2>
            {firestore && (
              <StatusButton
                status={
                  firestore.status === 'ok'
                    ? 'ok'
                    : firestore.status === 'permission-denied'
                      ? 'warning'
                      : 'error'
                }
                label={
                  firestore.status === 'ok'
                    ? 'Connected'
                    : firestore.status === 'permission-denied'
                      ? 'Reachable'
                      : 'Failed'
                }
                disabled
              />
            )}
          </div>
          {isChecking && !firestore && <Spinner label="Checking Firestore" />}
          {firestore && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {firestore.message} <span className="text-gray-400 dark:text-gray-500">({firestore.latencyMs}ms)</span>
            </p>
          )}
        </section>

        {/* Firebase Auth */}
        <section
          className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="auth-heading"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="auth-heading" className="text-base font-semibold text-gray-900 dark:text-white">
              Firebase Auth
            </h2>
            {!isAuthLoading && (
              <StatusButton
                status={user ? 'ok' : 'warning'}
                label={user ? 'Signed in' : 'Signed out'}
                disabled
              />
            )}
          </div>
          {isAuthLoading ? (
            <Spinner label="Checking auth state" />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user ? `Signed in as ${user.email}` : 'No user is currently signed in.'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}