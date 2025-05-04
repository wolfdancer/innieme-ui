import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const WebTrafficAnalysis = () => {
  // Anonymized legitimate IP addresses only
  // Original: 99.0.80.150, 174.195.80.39, 67.163.187.233, 71.212.198.43, 174.195.85.144, 107.220.119.99, 24.5.102.71, 204.156.69.80, 76.126.185.91
  // Scrambled: 10.0.0.1, 10.0.0.2, 10.0.0.3, 10.0.0.4, 10.0.0.5, 10.0.0.6, 10.0.0.7, 10.0.0.8, 10.0.0.9
  
  // IP address distribution data - separated by legitimate and suspicious
  const legitimateIpData = [
    { name: '10.0.0.1', requests: 9, color: '#8884d8' }, // Added May 2 requests (99.0.80.150)
    { name: '10.0.0.2', requests: 2, color: '#8884d8' },
    { name: '10.0.0.3', requests: 2, color: '#8884d8' },
    { name: '10.0.0.4', requests: 1, color: '#8884d8' },
    { name: '10.0.0.5', requests: 1, color: '#8884d8' }, // May 2 - 174.195.85.144
    { name: '10.0.0.6', requests: 3, color: '#8884d8' }, // May 2 - 107.220.119.99
    { name: '10.0.0.7', requests: 2, color: '#8884d8' }, // May 2 - 24.5.102.71
    { name: '10.0.0.8', requests: 3, color: '#8884d8' }, // May 2 - 204.156.69.80
    { name: '10.0.0.9', requests: 4, color: '#8884d8' }, // May 2 - 76.126.185.91
  ];
  
  const suspiciousIpData = [
    { name: '154.83.103.111', requests: 4, color: '#ff8042' },
    { name: '78.153.140.179', requests: 3, color: '#ff8042' },
    { name: '196.241.66.194', requests: 1, color: '#ff8042' },
    { name: '60.221.228.127', requests: 1, color: '#ff8042' },
    { name: '113.143.36.150', requests: 1, color: '#ff8042' },
    { name: '45.148.10.42', requests: 2, color: '#ff8042' }, // May 2 suspicious
  ];

  // OS distribution data - separated by legitimate and suspicious
  const osData = [
    { name: 'macOS (Legitimate)', count: 13, color: '#8884d8' }, // +3 for May 2
    { name: 'Android (Legitimate)', count: 3, color: '#82ca9d' }, // +1 for May 2
    { name: 'iOS (Legitimate)', count: 5, color: '#82ca9d' }, // New for May 2 (iPhone users)
    { name: 'Windows (Legitimate)', count: 3, color: '#82ca9d' }, // From May 2
    { name: 'Unknown (Suspicious)', count: 8, color: '#ffbb28' }, // +2 for May 2
  ];
  
  // Browser distribution data - separated by legitimate and suspicious
  const browserData = [
    { name: 'Chrome (Legitimate)', count: 6, color: '#8884d8' }, // Updated for May 2
    { name: 'Edge (Legitimate)', count: 12, color: '#82ca9d' }, // +3 for May 2
    { name: 'Mobile Chrome (Legitimate)', count: 1, color: '#8884d8' }, // From May 2
    { name: 'Mobile Safari (Legitimate)', count: 5, color: '#82ca9d' }, // New for May 2 (iPhone browsers)
    { name: 'LinkedIn App', count: 3, color: '#8884d8' }, // New for May 2
    { name: 'Custom Client (Suspicious)', count: 7, color: '#ff8042' },
    { name: 'l9explore Agent (Suspicious)', count: 2, color: '#ff8042' }, // From May 2
    { name: 'Multiple Agents (Suspicious)', count: 3, color: '#ffbb28' },
  ];

  // Timeline data - hour by hour for Apr 29-May 2 (Pacific Time)
  const timelineData = [
    { name: 'Apr 29, 12:05', type: 'Legitimate', ip: '10.0.0.1', count: 1 },
    { name: 'Apr 29, 12:09', type: 'Legitimate', ip: '10.0.0.1', count: 1 },
    { name: 'Apr 29, 13:40', type: 'Legitimate', ip: '10.0.0.4', count: 1 },
    { name: 'Apr 29, 14:43', type: 'Legitimate', ip: '10.0.0.2', count: 1 },
    { name: 'Apr 29, 14:44', type: 'Legitimate', ip: '10.0.0.2', count: 1 },
    { name: 'Apr 29, 15:27', type: 'Suspicious', ip: '154.83.103.111', count: 4, activity: 'Config Probe' },
    { name: 'Apr 29, 19:38', type: 'Legitimate', ip: '10.0.0.3', count: 1 },
    { name: 'Apr 29, 19:39', type: 'Legitimate', ip: '10.0.0.3', count: 1 },
    { name: 'Apr 29, 21:33', type: 'Legitimate', ip: '10.0.0.1', count: 2 },
    { name: 'Apr 29, 21:37', type: 'Legitimate', ip: '10.0.0.1', count: 1 },
    { name: 'Apr 29, 21:44', type: 'Legitimate', ip: '10.0.0.1', count: 1 },
    { name: 'Apr 29, 21:45', type: 'Legitimate', ip: '10.0.0.1', count: 1 },
    { name: 'Apr 29, 23:02', type: 'Suspicious', ip: '196.241.66.194', count: 1, activity: 'PHP Exploit' },
    { name: 'Apr 30, 00:09', type: 'Suspicious', ip: '60.221.228.127', count: 1, activity: 'PHP Exploit' },
    { name: 'Apr 30, 02:55', type: 'Suspicious', ip: '113.143.36.150', count: 1, activity: 'PHP Exploit' },
    { name: 'Apr 30, 06:25', type: 'Suspicious', ip: '78.153.140.179', count: 3, activity: 'Config Probe' },
    { name: 'May 02, 00:18', type: 'Legitimate', ip: '10.0.0.5', count: 1, activity: 'Chat API' },
    { name: 'May 02, 04:39', type: 'Legitimate', ip: '10.0.0.1', count: 1, activity: 'Chat API' },
    { name: 'May 02, 10:08', type: 'Suspicious', ip: '45.148.10.42', count: 2, activity: 'Config Probe' },
    { name: 'May 02, 15:13', type: 'Legitimate', ip: '10.0.0.6', count: 1, activity: 'Chat API' },
    { name: 'May 02, 15:14', type: 'Legitimate', ip: '10.0.0.6', count: 1, activity: 'Chat API' },
    { name: 'May 02, 15:15', type: 'Legitimate', ip: '10.0.0.6', count: 1, activity: 'Chat API' },
    { name: 'May 02, 17:28', type: 'Legitimate', ip: '10.0.0.7', count: 1, activity: 'Chat API' },
    { name: 'May 02, 17:28', type: 'Legitimate', ip: '10.0.0.7', count: 1, activity: 'Chat API' },
    { name: 'May 02, 17:54', type: 'Legitimate', ip: '10.0.0.8', count: 1, activity: 'Chat API' },
    { name: 'May 02, 17:54', type: 'Legitimate', ip: '10.0.0.8', count: 1, activity: 'Chat API' },
    { name: 'May 02, 17:55', type: 'Legitimate', ip: '10.0.0.8', count: 1, activity: 'Chat API' },
    { name: 'May 02, 18:52', type: 'Legitimate', ip: '10.0.0.9', count: 1, activity: 'Chat API' },
    { name: 'May 02, 18:53', type: 'Legitimate', ip: '10.0.0.9', count: 1, activity: 'Chat API' },
    { name: 'May 02, 18:53', type: 'Legitimate', ip: '10.0.0.9', count: 1, activity: 'Chat API' },
    { name: 'May 02, 18:54', type: 'Legitimate', ip: '10.0.0.9', count: 1, activity: 'Chat API' },
  ];

  // Group hourly requests - bar chart
  const hourlyData = [
    { hour: 'Apr 29, 12h', legitimate: 2, suspicious: 0 },
    { hour: 'Apr 29, 13h', legitimate: 1, suspicious: 0 },
    { hour: 'Apr 29, 14h', legitimate: 2, suspicious: 0 },
    { hour: 'Apr 29, 15h', legitimate: 0, suspicious: 4 },
    { hour: 'Apr 29, 19h', legitimate: 2, suspicious: 0 },
    { hour: 'Apr 29, 21h', legitimate: 5, suspicious: 0 },
    { hour: 'Apr 29, 23h', legitimate: 0, suspicious: 1 },
    { hour: 'Apr 30, 00h', legitimate: 0, suspicious: 1 },
    { hour: 'Apr 30, 02h', legitimate: 0, suspicious: 1 },
    { hour: 'Apr 30, 06h', legitimate: 0, suspicious: 3 },
    { hour: 'May 02, 00h', legitimate: 1, suspicious: 0 },
    { hour: 'May 02, 04h', legitimate: 1, suspicious: 0 },
    { hour: 'May 02, 10h', legitimate: 0, suspicious: 2 },
    { hour: 'May 02, 15h', legitimate: 3, suspicious: 0 },
    { hour: 'May 02, 17h', legitimate: 4, suspicious: 0 },
    { hour: 'May 02, 18h', legitimate: 4, suspicious: 0 },
  ];

  // Request type distribution
  const requestData = [
    { name: 'Legitimate API', value: 27, color: '#8884d8' }, // Updated with May 2 data
    { name: 'Suspicious Probes', value: 12, color: '#ff8042' }, // Same as before
  ];

  // Topic distribution (new chart)
  const topicData = [
    { name: 'Scouting', value: 12, color: '#8884d8' },
    { name: 'Public Topic', value: 3, color: '#82ca9d' },
    { name: 'Other', value: 12, color: '#ffbb28' },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ff8042', '#ffbb28'];

  return (
    <div className="dashboard-container">
      <div className="chart-container">
        <h3 className="text-center font-bold text-lg mb-4">Traffic by Hour (Pacific Time)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={hourlyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="legitimate" name="Legitimate Requests" fill="#8884d8" />
            <Bar dataKey="suspicious" name="Suspicious Requests" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">OS Distribution by Traffic Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={osData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {osData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">Browser Distribution by Traffic Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={browserData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {browserData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">Legitimate Traffic by IP Address</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={legitimateIpData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="requests" name="Requests" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">Suspicious Traffic by IP Address</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={suspiciousIpData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="requests" name="Requests" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">Request Type Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={requestData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {requestData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">Topic Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={topicData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Detailed Timeline (Pacific Time)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Time (PT)</th>
                <th className="py-2 px-4 border">Type</th>
                <th className="py-2 px-4 border">IP Address</th>
                <th className="py-2 px-4 border">Requests</th>
                <th className="py-2 px-4 border">Activity</th>
              </tr>
            </thead>
            <tbody>
              {timelineData.map((entry, index) => (
                <tr key={index} className={entry.type === 'Suspicious' ? 'bg-red-50' : ''}>
                  <td className="py-1 px-4 border">{entry.name}</td>
                  <td className="py-1 px-4 border">{entry.type}</td>
                  <td className="py-1 px-4 border">{entry.ip}</td>
                  <td className="py-1 px-4 border">{entry.count}</td>
                  <td className="py-1 px-4 border">{entry.activity || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-bold text-lg mb-2">Reconstructed API Conversations</h3>
        <p className="text-sm text-gray-500 mb-2">From user 10.0.0.1 on Apr 29, 21:44-21:45 PT:</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "hello"</p>
          <p><span className="font-semibold">Assistant:</span> "Hello! How can I assist you today?"</p>
          <p><span className="font-semibold">User:</span> "test"</p>
          <p><span className="font-semibold">Assistant:</span> "Sure, feel free to ask me any questions or give me any tasks to help you with. I'm here to assist you!"</p>
          <p><span className="font-semibold">User:</span> "great that worked"</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">From user 10.0.0.6 on May 02, 15:13-15:15 PT:</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "How do I protect my group from bears?"</p>
          <p><span className="font-semibold">Assistant:</span> "To protect your group from bears while camping, store food in bear-resistant containers like metal bear boxes or bear bags hung high between trees. Avoid cooking and eating in your sleeping area. Keep a clean campsite, free of food scraps and trash. Make noise while hiking to alert bears of your presence. Follow guidelines from land managers and park rangers for bear safety. (Source: Scouting America guidelines)"</p>
          <p><span className="font-semibold">User:</span> "Fast walkers tend to move far ahead while slows ones stay behind stretching out the group. How do I keep the group together while hiking?"</p>
          <p><span className="font-semibold">Assistant:</span> "To keep the group together while hiking, set a pace that is comfortable for the slowest hiker. Have the slowest hiker lead the group, so they set the pace. Rest when needed, eat when hungry, and drink water frequently. Encourage communication within the group to ensure everyone is comfortable with the pace. (Source: Scouting America guidelines)"</p>
          <p><span className="font-semibold">User:</span> "Water is heavy but essential. How do we ensure a secure water supply?"</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">From user 10.0.0.7 on May 02, 17:28 PT:</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "Who are you"</p>
          <p><span className="font-semibold">Assistant:</span> "I am an Assistant Scoutmaster for Scouting America, here to help answer any questions you may have about scouting."</p>
          <p><span className="font-semibold">User:</span> "What are the best scouting programs"</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">From user 10.0.0.8 on May 02, 17:54-17:55 PT:</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "What is a good camp layout?"</p>
          <p><span className="font-semibold">Assistant:</span> "A good camp layout includes selecting a campsite that is away from potential hazards like dead trees, gullies, lone trees, and high ridges. The site should be large enough for tents and cooking, with good drainage and at least 200 feet away from lakes and streams. It's important to follow Leave No Trace principles and the Outdoor Code. (Source: Scouting America Camping Guide)"</p>
          <p><span className="font-semibold">User:</span> "How do I join a troop?"</p>
          <p><span className="font-semibold">Assistant:</span> "To join a troop, contact the troop directly or visit their meeting to speak with the Scoutmaster or Committee Chair. Fill out an application form, pay any necessary fees, and complete any required training. You may also need to purchase a uniform and handbook. (Source: Scouting America Membership Guidelines)"</p>
          <p><span className="font-semibold">User:</span> "Tell me about fire safety protocols for scouts"</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="font-bold text-lg mb-2 text-red-700">Security Alert Summary</h3>
        <p className="mb-2"><span className="font-semibold">Attack Type 1:</span> Configuration File Probing</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Multiple attempts to access environment files and configurations</li>
          <li>Targeting sensitive paths: /api/.env, /api/config/.env, /api/.git/config</li>
          <li>New attack on May 2nd: IP 45.148.10.42 using l9explore/1.2.2 user agent</li>
          <li>All requests received 404 status, indicating files not found</li>
        </ul>
        <p className="mb-2"><span className="font-semibold">Attack Type 2:</span> PHP Exploitation Attempts</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Multiple IPs attempting to access PHPUnit vulnerability</li>
          <li>Target path: /api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</li>
          <li>Request bodies contained PHP code for execution: <code>echo(md5("Hello PHPUnit"))</code></li>
          <li>All attempts received 404 responses, indicating file not found</li>
        </ul>
        <p className="mb-2"><span className="font-semibold">Attack Pattern Analysis:</span></p>
        <ul className="list-disc ml-6 mb-3">
          <li>Attacks are continuing with similar patterns over multiple days</li>
          <li>Multiple IPs from different regions suggest coordinated scanning</li>
          <li>Custom scanning tools being used (e.g., l9explore agent)</li>
          <li>Focusing on common vulnerabilities in PHP applications</li>
        </ul>
        <p className="mb-2"><span className="font-semibold">Security Recommendations:</span></p>
        <ul className="list-disc ml-6">
          <li>Implement WAF (Web Application Firewall) to block common attack patterns</li>
          <li>Set up rate limiting for API endpoints</li>
          <li>Implement IP-based blocking for repeatedly suspicious IPs</li>
          <li>Add request validation to reject malformed requests</li>
          <li>Consider geo-blocking for regions with no legitimate users</li>
          <li>Set up real-time monitoring and alerting for attack patterns</li>
          <li>Consider using a threat intelligence feed to proactively block known malicious IPs</li>
        </ul>
      </div>
      
      <div className="mt-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
        <h3 className="font-bold text-lg mb-2 text-blue-700">May 2, 2025 Traffic Analysis</h3>
        <p className="mb-2"><span className="font-semibold">Key Insights:</span></p>
        <ul className="list-disc ml-6 mb-3">
          <li>Total Legitimate Requests: 15</li>
          <li>Total Suspicious Requests: 2</li>
          <li>Primary Topic: Scouting (12 requests)</li>
          <li>Device Distribution: 45% iOS, 30% macOS, 25% Windows</li>
          <li>Peak Hours: 17:00-19:00 PT (8 requests)</li>
          <li>New User-Agents Detected: LinkedIn App Browser</li>
        </ul>
        <p className="mb-2"><span className="font-semibold">User Behavior Patterns:</span></p>
        <ul className="list-disc ml-6">
          <li>Most users are asking about scouting-related topics</li>
          <li>Multiple conversations about outdoor safety and camping techniques</li>
          <li>Growing mobile usage (5 iOS requests vs. 3 desktop requests)</li>
          <li>Short, focused conversations (average 2-3 messages per user)</li>
          <li>Multiple new users accessing the platform for the first time</li>
        </ul>
      </div>
    </div>
  );
};

export default WebTrafficAnalysis;