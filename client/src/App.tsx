import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

const API_URL = window.location.protocol === 'https:' 
  ? `${window.location.protocol}//${window.location.hostname}`
  : `${window.location.protocol}//${window.location.hostname}:3001`;

interface AppProps {
  topic_id?: string;  // Making it optional in case App is used without a topic_id
}

const App: React.FC<AppProps> = ({ topic_id }) => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState<Array<{
        ping?: string;
        pong?: string;
        received?: string;
        responded?: string;
        error?: string;
        timestamp?: number;
    }>>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const chat = async () => {
        if (!message.trim()) return;

        setLoading(true);
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            try {
                const history = responses.flatMap(r => [
                    { role: 'user', content: r.ping},
                    { role: 'assistant', content: r.pong}
                ]);
                
                const result = await axios.post(`${API_URL}/api/chat`, {
                    topic: topic_id,
                    message: message,
                    history: history
                });
                
                // Success! Update state and exit
                setResponses(prev => [...prev, result.data]);
                setMessage(''); // Clear input after successful send
                setError(null); // Clear any previous error
                setLoading(false);
                return;
                
            } catch (error) {
                attempts++;
                
                // Check if it's a 503 error and we haven't reached max attempts
                if (axios.isAxiosError(error) && error.response?.status === 503 && attempts < maxAttempts) {
                    // Calculate backoff delay with jitter: base * (2^attempt) * random factor
                    const backoffMs = 1000 * Math.pow(2, attempts - 1) * (0.5 + Math.random());
                    setError('Service unavailable. Retrying...');
                    console.log(`Attempt ${attempts} failed with 503 error. Retrying in ${Math.round(backoffMs)}ms...`);
                    await new Promise(resolve => setTimeout(resolve, backoffMs));
                } else {
                    // For non-503 errors or after max attempts, handle as usual
                    console.error('Error:', error);
                    setError(error instanceof Error ? error.message : `${error}`);
                    setLoading(false);
                    return;
                }
            }
        }
        
        // If we've exhausted all attempts
        setError("Service unavailable after multiple attempts. Please try again later.");
        setLoading(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to InnieMe! How can I help you today?</h1>
                
                <div className="messages-history">
                    {responses.map((response, index) => (
                        response.ping && response.pong ? (
                            <React.Fragment key={`conversation-${index}`}>
                                <div key={`user-${response.received}`} className="user-message">
                                    <span className="label">You:</span>
                                    <span className="timestamp">{response.received}</span>
                                    <span className="content">{response.ping}</span>
                                </div>
                                <div key={`user-${response.responded}`} className="bot-message">
                                    <span className="label">InnieMe:</span>
                                    <span className="timestamp">{response.responded}</span>
                                    <span className="content">
                                        <ReactMarkdown skipHtml={true}>{response.pong}</ReactMarkdown>
                                    </span>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div key={`error-${response.timestamp || Date.now()}`} className="error-message">
                                {response.error}
                            </div>
                        )
                    ))}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter a message"
                        onKeyDown={(e) => e.key === 'Enter' && chat()}
                    />
                    <button onClick={chat} disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>

                {error && (
                    <div className="error-container">
                        <h2>Error:</h2>
                        <pre className="error-message">{error}</pre>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;