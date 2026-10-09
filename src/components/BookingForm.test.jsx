import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe"
import BookingForm from "./BookingForm";

async function fillValidForm(user) {
    await user.type(screen.getByLabelText('Full name'), 'Remi Jacobs')
    await user.type(screen.getByLabelText('Email address'), 'remi@example.com')
    await user.selectOptions(screen.getByLabelText('Room'), 'Quiet Room B (up to 8)')
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-01-01' } })
    fireEvent.change(screen.getByLabelText('Start time'), { target: { value: '10:00' } })
    await user.type(screen.getByLabelText('Number of people'), '3')
}

describe('Booking Form', () => {
    it('has no axe violations', async () => {
        const { container } = render(<BookingForm />)
        expect(await axe(container)).toHaveNoViolations()
    })

    it('shows linked errors, sets aria-invalid and moves focus on a bad submit', async () => {
        const user = userEvent.setup()
        render(<BookingForm />)
        await user.click(screen.getByRole('button', { name: 'Reserve room' }))

        const name = screen.getByLabelText('Full name')
        expect(name).toHaveAttribute('aria-invalid', 'true')
        expect(name).toHaveAttribute('aria-describedby', 'name-error')
        expect(screen.getByText('Error: Enter your full name.')).toBeInTheDocument()
        expect(name).toHaveFocus()
    })

    it('announces the problem count in the live region', async () => {
        const user = userEvent.setup()
        render(<BookingForm />)
        await user.click(screen.getByRole('button', { name: 'Reserve room' }))
        const live = document.querySelector('[aria-live="assertive"]')
        expect(live).toHaveTextContent('6 problems found')
    })

    it('rejects more people than the room holds', async () => {
        const user = userEvent.setup()
        render(<BookingForm />)
        await user.selectOptions(screen.getByLabelText('Room'), 'Quiet Room A (up to 2)')
        await user.type(screen.getByLabelText('Number of people'), '5')
        await user.click(screen.getByRole('button', { name: 'Reserve room' }))
        expect(screen.getByText(/holds up to 2 people/)).toBeInTheDocument()
    })

    it('opens the review dialog, then moves focus to the confirmation heading', async () => {
        const user = userEvent.setup()
        render(<BookingForm />)
        await fillValidForm(user)
        await user.click(screen.getByRole('button', { name: 'Reserve room' }))

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Confirm booking' }))

        const heading = screen.getByRole('heading', { name: 'Booking confirmed' })
        expect(heading).toHaveFocus()
    })
})