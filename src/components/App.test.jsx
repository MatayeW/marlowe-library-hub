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

    it('lets someone search from Home and lands on the filtered catalogue', async () => {
        const user = userEvent.setup()
        render(<App />)
        await user.type(screen.getByLabelText('Search courses'), 'spanish')
        await user.click(screen.getByRole('button', { name: 'Search the catalogue' }))
        expect(screen.getByRole('heading', { name: 'Course Catalogue' })).toHaveFocus()
        expect(screen.getByLabelText('Search courses')).toHaveValue('spanish')
        expect(screen.getByRole('status')).toHaveTextContent('1 course found')
    })

    it('completes the journey: Home, register for a course, confirmation', async () => {
        const user = userEvent.setup()
        render(<App />)
        await user.click(screen.getByRole('button', { name: 'Register for Introduction to Computers' }))

        expect(screen.getByRole('heading', { name: 'Register for Introduction to Computers' })).toHaveFocus()
        expect(document.title).toBe('Register | Riverside Public Library')

        await user.type(screen.getByLabelText('Full name'), 'Remi Jacobs')
        await user.type(screen.getByLabelText('Email address'), 'remi@example.com')
        await user.click(screen.getByRole('button', { name: 'Register for this course' }))

        expect(screen.getByRole('heading', { name: 'Registration confirmed' })).toHaveFocus()
        await user.click(screen.getByRole('button', { name: 'Back to courses' }))
        expect(screen.getByRole('heading', { name: 'Course Catalogue' })).toHaveFocus()
    })

    it('reaches registration from the course catalogue too', async () => {
        const user = userEvent.setup()
        render(<App />)
        await user.click(screen.getByRole('button', { name: 'Courses' }))
        await user.click(screen.getByRole('button', { name: 'Register for Spanish for Beginners' }))
        expect(screen.getByRole('heading', { name: 'Register for Spanish for Beginners' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Courses' })).toHaveAttribute('aria-current', 'page')
    })

    it('has no axe violations on the registration page', async () => {
        const user = userEvent.setup()
        const { container } = render(<App />)
        await user.click(screen.getByRole('button', { name: 'Register for Introduction to Computers' }))
        expect(await axe(container)).toHaveNoViolations()
    })
})
