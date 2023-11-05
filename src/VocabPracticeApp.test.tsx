import { render, screen } from '@testing-library/react'
import { VocabPracticeApp } from './VocabPracticeApp'

test('renders learn react link', () => {
  render(<VocabPracticeApp />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
