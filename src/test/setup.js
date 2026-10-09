import '@testing-library/jest-dom/vitest'
import { afterEach, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

afterEach(() => {
    cleanup()
})

if (typeof HTMLDialogElement !== 'undefined') {
    if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = function () {
            this.setAttribute('open', '')
        }
    }
    if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = function () {
            this.removeAttribute('open')
        }
    }
}