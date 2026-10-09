import { describe, it, expect } from "vitest";
import { render, screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event";
import { axe } from 'vitest-axe'
import App from "../App";

describe('App', () => {
    it('has no axe violations', async () => {
        const { container } = render(<App />)
        expect(await axe(container)).toHaveNoViolations()
    })

    it('moves focus to the new page heading and updates the title', async () => {
        const user = userEvent.setup()
        render(<App />)
        await user.click(screen.getByRole('button', { name: 'Courses' }))
        expect(screen.getByRole('heading', { name: 'Course Catalogue' })).toHaveFocus()
        expect(document.title).toBe('Courses | Riverside Public Library')
    })

    it('marks the current page in the navigation', async () => {
        const user = userEvent.setup()
        render(<App />)
        await user.click(screen.getByRole('button', { name: 'Book a room' }))
        expect(screen.getByRole('button', { name: 'Book a room'})).toHaveAttribute('aria-current', 'page')
    })
})