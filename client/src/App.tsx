import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const pingHeartbeat = async () => {
        if (!message.trim()) return;

        setLoading(true);
        try {
            const result = await axios.get(`http://localhost:3001/api/heartbeat?message=${encodeURIComponent(message)}`);
            setResponse(result.data);
        } catch (error) {
            console.error('Error:', error);
            setResponse({ error: 'Failed to connect to the server' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>InnieMe Heartbeat Test</h1>
                <div className="input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter a message"
                        onKeyPress={(e) => e.key === 'Enter' && pingHeartbeat()}
                    />
                    <button onClick={pingHeartbeat} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Heartbeat'}
                    </button>
                </div>

                {response && (
                    <div className="response-container">
                        <h2>Response:</h2>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;