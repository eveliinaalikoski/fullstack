import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('creating a new blog, blogform calls functions with right info', async () => {
  const user = userEvent.setup();
  const mockCreateBlog = vi.fn();

  render(<BlogForm createBlog={mockCreateBlog} />);

  const titleInput = screen.getByPlaceholderText('title');
  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');
  const createButton = screen.getByText('create');

  await user.type(titleInput, 'testing title');
  await user.type(authorInput, 'tester author');
  await user.type(urlInput, 'https://test.testing');
  await user.click(createButton);

  expect(mockCreateBlog.mock.calls).toHaveLength(1);
  expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual({
    title: 'testing title',
    author: 'tester author',
    url: 'https://test.testing',
  });
});
