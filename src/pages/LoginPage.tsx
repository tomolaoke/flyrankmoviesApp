import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { GoogleSignInButton } from '../components/common/GoogleSignInButton'
import { Input } from '../components/common/Input'
import { loginSchema, type LoginFormValues } from '../schemas/authSchema'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'

/** Login page. Errors surface only after a field is touched or on submit (mode: 'onTouched'). */
export function LoginPage() {
  const { login, loginWithGoogle, isSubmitting, error } = useAuthViewModel()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.email, values.password)
    if (success) navigate(redirectTo, { replace: true })
  }

  const handleGoogleSignIn = async () => {
    const success = await loginWithGoogle()
    if (success) navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-900">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">Log in</h1>
        {error && <ErrorMessage message={error} />}

        <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isSubmitting} />

        <div
          className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500"
          role="separator"
          aria-label="or continue with email"
        >
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
          or continue with email
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4" aria-busy={isSubmitting}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Log in
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-brand-600 hover:underline dark:text-brand-400 dark:hover:text-brand-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}