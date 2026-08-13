import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsForm } from './SettingsForm'
import { settingsDefaultValues } from '../../schemas/settingsSchema'

const defaultValues = { ...settingsDefaultValues, email: 'user@example.com' }

describe('SettingsForm', () => {
  it('renders all fields with accessible labels', () => {
    render(<SettingsForm defaultValues={defaultValues} onSubmit={jest.fn()} />)

    expect(screen.getByLabelText('Email')).toHaveValue('user@example.com')
    expect(screen.getByLabelText('New password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument()
    expect(screen.getByLabelText('Email me about notifications')).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Save settings' })).toBeInTheDocument()
  })

  it('does not show a validation error before the field is touched', () => {
    render(<SettingsForm defaultValues={{ ...defaultValues, email: '' }} onSubmit={jest.fn()} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a validation error after the email field is touched and left invalid', async () => {
    const user = userEvent.setup()
    render(<SettingsForm defaultValues={{ ...defaultValues, email: '' }} onSubmit={jest.fn()} />)

    const emailInput = screen.getByLabelText('Email')
    await user.click(emailInput)
    await user.type(emailInput, 'not-an-email')
    await user.tab()

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('shows a validation error on submit when required fields are missing', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()
    render(<SettingsForm defaultValues={{ ...defaultValues, email: '' }} onSubmit={handleSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Save settings' }))

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('shows a mismatch error when password and confirm password differ', async () => {
    const user = userEvent.setup()
    render(<SettingsForm defaultValues={defaultValues} onSubmit={jest.fn()} />)

    await user.type(screen.getByLabelText('New password'), 'password123')
    await user.type(screen.getByLabelText('Confirm new password'), 'different123')
    await user.click(screen.getByRole('button', { name: 'Save settings' }))

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument()
  })

  it('submits valid values and calls onSubmit with the form data', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()
    render(<SettingsForm defaultValues={defaultValues} onSubmit={handleSubmit} />)

    await user.click(screen.getByLabelText('Email me about notifications'))
    await user.click(screen.getByRole('button', { name: 'Save settings' }))

    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1))
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        password: '',
        confirmPassword: '',
        notificationsEnabled: true,
      }),
      expect.anything(),
    )
  })

  it('disables the submit button and marks the form busy while submitting', () => {
    render(<SettingsForm defaultValues={defaultValues} onSubmit={jest.fn()} isSubmitting />)

    expect(screen.getByRole('button', { name: 'Save settings' })).toBeDisabled()
    expect(screen.getByLabelText('Account settings', { selector: 'form' })).toHaveAttribute('aria-busy', 'true')
  })

  it('renders a submit error message when provided', () => {
    render(<SettingsForm defaultValues={defaultValues} onSubmit={jest.fn()} submitError="Something went wrong" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })
})
