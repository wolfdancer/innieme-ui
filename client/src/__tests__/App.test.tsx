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
    expect(screen.getByText('InnieMe Heartbeat Test')).toBeInTheDocument();
    
    // Check if input and button are rendered
    expect(screen.getByPlaceholderText('Enter a message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Heartbeat' })).toBeInTheDocument();
    
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
    const exxpectedResponse = "Hello Mock!"
    // Mock successful response
    const mockResponse = { 
      data: { 
        ping: message,
        pong: exxpectedResponse,
        received: new Date().toISOString(),
        responded: new Date().toISOString()
      } 
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<App />);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, message);
    
    // Click the button
    const button = screen.getByRole('button', { name: 'Send Heartbeat' });
    await userEvent.click(button);
    
    // Check if axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:3001/api/heartbeat?message=Hello%20World'
    );
    
    // Check if response is displayed after API call
    await waitFor(() => {
      // Check the message container structure
      const messageContainer = document.querySelector('.message-container');
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
      expect(botMessageDiv.querySelector('.label')).toHaveTextContent('Bot:');
      expect(botMessageDiv.querySelector('.content')).toHaveTextContent(exxpectedResponse);

      // Check JSON response
      const responseJson = screen.getByText((content) => {
        return content.includes(`"ping": "${message}"`) &&
               content.includes(`"pong": "${exxpectedResponse}"`) &&
               content.includes('"received":') &&
               content.includes('"responded":');
      });
      
      expect(screen.getByText('Response:')).toBeInTheDocument();
      expect(responseJson).toBeInTheDocument();
      expect(responseJson.tagName.toLowerCase()).toBe('pre');
    });
    
  });

  test('handles API error', async () => {
    // Mock error response
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    render(<App />);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, 'Hello World');
    
    // Click the button
    const button = screen.getByRole('button', { name: 'Send Heartbeat' });
    await userEvent.click(button);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to connect to the server/)).toBeInTheDocument();
    });
  });

  test('makes API call when Enter key is pressed', async () => {
    const mockResponse = { 
      data: { 
        ping: "hello",
        pong: "hello back",
        received: new Date().toISOString(),
        responded: new Date().toISOString()
      } 
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    render(<App />);
    
    // Type in the input and press Enter
    const input = screen.getByPlaceholderText('Enter a message');
    await userEvent.type(input, 'Hello World{enter}');
    
    // Check if axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:3001/api/heartbeat?message=Hello%20World'
    );
  });

  test('does not make API call when input is empty', async () => {
    render(<App />);
    
    // Click the button without typing anything
    const button = screen.getByRole('button', { name: 'Send Heartbeat' });
    await userEvent.click(button);
    
    // Ensure axios was not called
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});