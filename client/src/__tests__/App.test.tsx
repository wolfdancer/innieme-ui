import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import '@testing-library/jest-dom';

// Mock axios
import { jest } from '@jest/globals';
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the app with initial state', () => {
    render(<App />);
    
    // Check if title is rendered
    expect(screen.getByText('Welcome to InnieMe! How can I help you today?')).toBeInTheDocument();
    
    // Check if input and button are rendered
    expect(screen.getByPlaceholderText('Enter a message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    
    // Response should not be visible initially
    expect(screen.queryByText('Response:')).not.toBeInTheDocument();
  });

  test('updates input value when user types', async () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  test('makes API call when button is clicked', async () => {
    const message = 'Hello World';
    const expectedResponse = "Hello Mock!"
    // Mock successful response
    const mockResponse = { 
      data: { 
        ping: message,
        pong: expectedResponse,
        received: "received",
        responded: "responded"
      } 
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    
    render(<App />);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, message);
    
    // Click the button
    const button = screen.getByRole('button', { name: 'Send' });
    await userEvent.click(button);
    
    // Check if axios was called correctly with the new endpoint and body
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/chat',
      {
        message: message,
        history: []  // Initially empty as there are no previous responses
      }
    );
    
    // Rest of the test remains the same
    await waitFor(() => {
      // Check the message container structure
      const messageContainer = document.querySelector('.messages-history');
      expect(messageContainer).toBeInTheDocument();
      if (!messageContainer) {
        throw new Error('Message container not found');
      }
      const messageChildren = messageContainer.children;
      expect(messageChildren).toHaveLength(2);

      // Check first message div (user message)
      const userMessageDiv = messageChildren[0];
      expect(userMessageDiv.querySelector('.label')).toHaveTextContent('You:');
      expect(userMessageDiv.querySelector('.content')).toHaveTextContent(message);
      
      // Check second message div (bot message)
      const botMessageDiv = messageChildren[1];
      expect(botMessageDiv.querySelector('.label')).toHaveTextContent('InnieMe:');
      expect(botMessageDiv.querySelector('.content')).toHaveTextContent(expectedResponse);
    });
    
  });

  test('handles API error', async () => {
    // Mock error response
    mockedAxios.post.mockRejectedValueOnce(new Error('Mocking Network Error'));
    
    render(<App />);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, 'Hello World');
    
    // Click the button
    const button = screen.getByRole('button', { name: 'Send' });
    await userEvent.click(button);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Mocking Network Error/)).toBeInTheDocument();
    });
  });

  test('makes API call when Enter key is pressed', async () => {
    const mockResponse = { 
      data: { 
        ping: "hello",
        pong: "hello back",
        received: "receieved-api",
        responded: "responded-api"
      } 
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    
    render(<App />);
    
    // Type in the input and press Enter
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, 'Hello World{enter}');
    
    // Check if axios was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/chat',
      {
        message: 'Hello World',
        history: []  // Initially empty as there are no previous responses
      }
    );
  });

  test('does not make API call when input is empty', async () => {
    render(<App />);
    
    // Click the button without typing anything
    const button = screen.getByRole('button', { name: 'Send' });
    await userEvent.click(button);
    
    // Ensure axios was not called
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});