import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title and author of a blog', () => {
  const blog = {
    title: 'testing title',
    author: 'tester author',
    url: 'https://test.testing',
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText('testing title tester author');
  expect(element).toBeDefined();
});

test('renders all information when view button has been clicked', async () => {
  const userInfo = [
    {
      username: 'testi username',
      name: 'testi name',
      id: '12345',
    },
  ];
  const blog = {
    title: 'testing title',
    author: 'tester author',
    url: 'https://test.testing',
    likes: 2,
    user: userInfo,
    id: '54321',
  };

  render(<Blog blog={blog} user={userInfo} />);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  expect(screen.getByText('testing title tester author')).toBeDefined();
  expect(screen.getByText('https://test.testing')).toBeDefined();
  expect(screen.getByText('likes 2')).toBeDefined();
  expect(screen.getByText('testi username')).toBeDefined();
});

test('clicking the like button twice calls event handler twice', async () => {
  const userInfo = [
    {
      username: 'testi username',
      name: 'testi name',
      id: '12345',
    },
  ];
  const blog = {
    title: 'testing title',
    author: 'tester author',
    url: 'https://test.testing',
    likes: 2,
    user: userInfo,
    id: '54321',
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} user={userInfo} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
