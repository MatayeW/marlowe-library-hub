import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe"
import RegistrationForm from "./RegistrationForm";
import { courses } from "../data/courses";

const course = courses[0]

describe('Registration Form', () => {
    it('has no axe violations', async () => {
        const { container } = render(<RegistrationForm course={course} onBackToCourses={() => {}} />)
        expect(await axe(container)).toHaveNoViolations()
    })

    it('shows linked errors and moves focus on a bad submit', async () => {
        const user = userEvent.setup()
        render(<RegistrationForm course={course} onBackToCourses={() => {}} />)
        await user.click(screen.getByRole('button', { name: 'Register for this course' }))

        const name = screen.getByLabelText('Full name')
        expect(name).toHaveAttribute('aria-invalid', 'true')
        expect(name).toHaveAttribute('aria-describedby', 'name-error')
        expect(name).toHaveFocus()
        expect(document.querySelector('[aria-live="assertive"]')).toHaveTextContent('2 problems found')
    })

    it('announces an error as soon as someone leaves the email field', async () => {
        const user = userEvent.setup()
        render(<RegistrationForm course={course} onBackToCourses={() => {}} />)
        await user.type(screen.getByLabelText('Email address'), 'not-an-email')
        await user.tab()
        expect(document.querySelector('[aria-live="assertive"]'))
            .toHaveTextContent('Error: Email address. Enter an email address like name@example.com.')
    })

    it('confirms the registration and moves focus to the confirmation heading', async () => {
        const user = userEvent.setup()
        render(<RegistrationForm course={course} onBackToCourses={() => {}} />)
        await user.type(screen.getByLabelText('Full name'), 'Remi Jacobs')
        await user.type(screen.getByLabelText('Email address'), 'remi@example.com')
        await user.click(screen.getByRole('button', { name: 'Register for this course' }))
        expect(screen.getByRole('heading', { name: 'Registration confirmed' })).toHaveFocus()
        expect(screen.getByText(/remi@example.com/)).toBeInTheDocument()
    })
})
