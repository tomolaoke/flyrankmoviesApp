import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { GoogleSignInButton } from '../components/common/GoogleSignInButton'
import { Input } from '../components/common/Input'
import { signupSchema, type SignupFormValues } from '../schemas/authSchema'
import { useAuthViewModel } from '../viewmodels/useAuthViewModel'

/** Signup page. Errors surface only after a field is touched or on submit (mode: 'onTouched'). */
export function SignupPage() {
  const { register: signUp, loginWithGoogle, isSubmitting, error } = useAuthViewModel()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: SignupFormValues) => {
    const success = await signUp(values.email, values.password)
    if (success) navigate('/', { replace: true })
  }

  const handleGoogleSignIn = async () => {
    const success = await loginWithGoogle()
    if (success) navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Sign up</h1>
      {error && <ErrorMessage message={error} />}

      <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isSubmitting} />

      <div className="flex items-center gap-3 text-xs text-gray-400" role="separator" aria-label="or continue with email">
        <span className="h-px flex-1 bg-gray-200" />
        or continue with email
        <span className="h-px flex-1 bg-gray-200" />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
