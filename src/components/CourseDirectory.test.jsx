import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import CourseDirectory from "./CourseDirectory";

describe('CourseDirectory', () => {
    it('has no axe violations', async () => {
        const { container } = render(<CourseDirectory />)
        expect(await axe(container)).toHaveNoViolations()
    })

    it('shows all courses at first', () => {
        render(<CourseDirectory />)
        expect(screen.getByRole('status')).toHaveTextContent('6 courses found')
    })

    it('updates the live count when searching', async () => {
        const user = userEvent.setup()
        render(<CourseDirectory />)
        await user.type(screen.getByLabelText('Search courses'), 'comp')
        expect(screen.getByRole('status')).toHaveTextContent('1 course found')
    })
    
    it('toggles aria-expanded on the Filters button', async () => {
        const user = userEvent.setup()
        render(<CourseDirectory />)
        const button = screen.getByRole('button', { name: /^Filters/ })
        expect(button).toHaveAttribute('aria-expanded', 'false')
        await user.click(button)
        expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles aria-pressed and filters the results', async () => {
        const user = userEvent.setup()
        render(<CourseDirectory />)
        await user.click(screen.getByRole('button', { name: /^Filters/ }))
        const online = screen.getByRole('button', { name: 'Online' })
        expect(online).toHaveAttribute('aria-pressed', 'false')
        await user.click(online)
        expect(online).toHaveAttribute('aria-pressed', 'true')
        expect(screen.getByRole('status')).toHaveTextContent('2 courses found')
    })
})