import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface AppProps {
  topic_id?: string;  // Making it optional in case App is used without a topic_id
}

const App: React.FC<AppProps> = ({ topic_id }) => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pingHeartbeat = async () => {
        if (!message.trim()) return;

        setLoading(true);
        try {
            const history = responses.flatMap(r => [
                { role: 'user', content: r.ping},
                { role: 'assistant', content: r.pong}
            ]);
            
            const result = await axios.post(`http://localhost:3001/api/chat`, {
                topic: topic_id,
                message: message,
                history: history
            });
            
            setResponses(prev => [...prev, result.data]);
            setMessage(''); // Clear input after successful send
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : `${error}`);
        } finally {
            setLoading(false);
        }
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
                                    <span className="content">{response.pong}</span>
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
                        onKeyDown={(e) => e.key === 'Enter' && pingHeartbeat()}
                    />
                    <button onClick={pingHeartbeat} disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>

                {error && (
                    <div className="error-container">
                        <h2>Error:</h2>
                        <pre className="error-message">{error}</pre>
                    </div>
                )}

                {responses.length > 0 && (
                    <div className="response-container">
                        <h2>Response History:</h2>
                        <pre>{JSON.stringify(responses, null, 2)}</pre>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;