import { Button } from '../components/common/Button'
import { Spinner } from '../components/common/Spinner'
import { StatusBadge } from '../components/common/StatusBadge'
import { useAuthContext } from '../context/useAuthContext'
import { useHealthCheckViewModel } from '../viewmodels/useHealthCheckViewModel'

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90"><rect width="60" height="90" fill="%23e5e7eb"/></svg>'

/**
 * Diagnostic page for verifying the app's external dependencies are
 * reachable: required env vars are set, OMDb returns real search results,
 * Firestore is reachable, and what Firebase Auth currently reports.
 * Not linked from the main flows a typical visitor would use — intended
 * for developers verifying local/deploy setup.
 */
export function HealthCheckPage() {
  const { envVars, omdb, firestore, isChecking, runChecks } = useHealthCheckViewModel()
  const { user, isLoading: isAuthLoading } = useAuthContext()

  const missingEnvVars = envVars.filter((v) => !v.present)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Health Check</h1>
          <p className="mt-1 text-sm text-gray-600">Live status of this app's external dependencies.</p>
        </div>
        <Button variant="secondary" onClick={runChecks} isLoading={isChecking}>
          Re-run checks
        </Button>
      </div>

      {/* Environment variables */}
      <section className="rounded-lg border border-gray-200 bg-white p-4" aria-labelledby="env-vars-heading">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="env-vars-heading" className="text-base font-semibold text-gray-900">
            Environment variables
          </h2>
          <StatusBadge
            status={missingEnvVars.length === 0 ? 'ok' : 'error'}
            label={missingEnvVars.length === 0 ? 'All set' : `${missingEnvVars.length} missing`}
          />
        </div>
        <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
          {envVars.map((envVar) => (
            <li key={envVar.name} className="flex items-center gap-2 text-gray-700">
              <span aria-hidden="true">{envVar.present ? '✅' : '❌'}</span>
              <code className="text-xs">{envVar.name}</code>
              <span className="sr-only">{envVar.present ? 'set' : 'not set'}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* OMDb API */}
      <section className="rounded-lg border border-gray-200 bg-white p-4" aria-labelledby="omdb-heading">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="omdb-heading" className="text-base font-semibold text-gray-900">
            OMDb API
          </h2>
          {omdb && (
            <StatusBadge status={omdb.status === 'ok' ? 'ok' : 'error'} label={omdb.status === 'ok' ? 'Connected' : 'Failed'} />
          )}
        </div>

        {isChecking && !omdb && <Spinner label="Checking OMDb" />}

        {omdb && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600">
              {omdb.message} <span className="text-gray-400">({omdb.latencyMs}ms)</span>
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
                    <span className="truncate text-xs text-gray-700" title={movie.title}>
                      {movie.title}
                    </span>
                    <span className="text-[11px] text-gray-400">{movie.year}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Firestore */}
      <section className="rounded-lg border border-gray-200 bg-white p-4" aria-labelledby="firestore-heading">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="firestore-heading" className="text-base font-semibold text-gray-900">
            Firestore
          </h2>
          {firestore && (
            <StatusBadge
              status={firestore.status === 'ok' ? 'ok' : firestore.status === 'permission-denied' ? 'warning' : 'error'}
              label={
                firestore.status === 'ok' ? 'Connected' : firestore.status === 'permission-denied' ? 'Reachable' : 'Failed'
              }
            />
          )}
        </div>
        {isChecking && !firestore && <Spinner label="Checking Firestore" />}
        {firestore && (
          <p className="text-sm text-gray-600">
            {firestore.message} <span className="text-gray-400">({firestore.latencyMs}ms)</span>
          </p>
        )}
      </section>

      {/* Firebase Auth */}
      <section className="rounded-lg border border-gray-200 bg-white p-4" aria-labelledby="auth-heading">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="auth-heading" className="text-base font-semibold text-gray-900">
            Firebase Auth
          </h2>
          {!isAuthLoading && <StatusBadge status={user ? 'ok' : 'warning'} label={user ? 'Signed in' : 'Signed out'} />}
        </div>
        {isAuthLoading ? (
          <Spinner label="Checking auth state" />
        ) : (
          <p className="text-sm text-gray-600">{user ? `Signed in as ${user.email}` : 'No user is currently signed in.'}</p>
        )}
      </section>
    </div>
  )
}
