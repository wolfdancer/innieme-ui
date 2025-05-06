import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const WebTrafficAnalysisUpdated = () => {
  // Updated with May 3-4 data - IP addresses obfuscated for privacy
  const legitimateIpData = [
    { name: 'User A', requests: 5, color: '#8884d8' },
    { name: 'User B', requests: 5, color: '#8884d8' },
    { name: 'User C', requests: 6, color: '#8884d8' },
    { name: 'User D', requests: 3, color: '#8884d8' },
    { name: 'User E', requests: 1, color: '#8884d8' },
    { name: 'User F', requests: 2, color: '#8884d8' },
    { name: 'User G', requests: 1, color: '#8884d8' }
  ];
  
  const suspiciousIpData = [
    { name: '8.215.3.241', requests: 1, color: '#ff8042' },
    { name: '103.96.75.159', requests: 1, color: '#ff8042' },
    { name: '124.115.231.142', requests: 1, color: '#ff8042' },
    { name: '192.210.241.208', requests: 1, color: '#ff8042' },
    { name: '178.128.69.83', requests: 2, color: '#ff8042' },
    { name: '36.133.51.163', requests: 1, color: '#ff8042' },
    { name: '34.34.185.61', requests: 1, color: '#ff8042' },
    { name: '58.211.18.68', requests: 2, color: '#ff8042' },
    { name: '8.208.47.7', requests: 1, color: '#ff8042' }
  ];

  // OS distribution data - updated with May 3-4 data
  const osData = [
    { name: 'macOS', count: 13, color: '#8884d8' },
    { name: 'Android', count: 8, color: '#82ca9d' },
    { name: 'iOS', count: 7, color: '#0088FE' },
    { name: 'Windows', count: 4, color: '#00C49F' }
  ];
  
  // Browser distribution data - updated with May 3-4 data
  const browserData = [
    { name: 'Chrome', count: 11, color: '#8884d8' },
    { name: 'Edge', count: 5, color: '#82ca9d' },
    { name: 'Mobile Chrome', count: 9, color: '#0088FE' },
    { name: 'Mobile Safari', count: 6, color: '#00C49F' },
    { name: 'WeChat Browser', count: 1, color: '#FFBB28' }
  ];

  // Updated hourly data with May 3-4 entries
  const hourlyData = [
    { hour: 'May 02, 21h', legitimate: 6, suspicious: 0 },
    { hour: 'May 02, 23h', legitimate: 2, suspicious: 0 },
    { hour: 'May 03, 03h', legitimate: 5, suspicious: 1 },
    { hour: 'May 03, 10h', legitimate: 0, suspicious: 1 },
    { hour: 'May 03, 17h', legitimate: 5, suspicious: 0 },
    { hour: 'May 03, 19h', legitimate: 0, suspicious: 0 },
    { hour: 'May 03, 20h', legitimate: 10, suspicious: 0 },
    { hour: 'May 03, 21h', legitimate: 1, suspicious: 1 },
    { hour: 'May 03, 22h', legitimate: 2, suspicious: 0 },
    { hour: 'May 04, 03h', legitimate: 2, suspicious: 0 },
    { hour: 'May 04, 06h', legitimate: 1, suspicious: 1 },
    { hour: 'May 04, 07h', legitimate: 0, suspicious: 2 },
    { hour: 'May 04, 14h', legitimate: 0, suspicious: 1 },
    { hour: 'May 04, 16h', legitimate: 0, suspicious: 1 },
    { hour: 'May 04, 17h', legitimate: 0, suspicious: 3 }
  ];

  // Updated request type distribution
  const requestData = [
    { name: 'Legitimate API', value: 23, color: '#8884d8' },
    { name: 'Suspicious Probes', value: 11, color: '#ff8042' }
  ];

  // Updated topic distribution
  const topicData = [
    { name: 'Scouting', value: 15, color: '#8884d8' },
    { name: 'Default', value: 5, color: '#82ca9d' },
    { name: 'Public Topic', value: 3, color: '#ff8042' }
  ];

  // Updated daily trend data
  const dailyTrendData = [
    { name: 'May 01', legitimate: 36, suspicious: 171 },
    { name: 'May 02', legitimate: 21, suspicious: 2 },
    { name: 'May 03', legitimate: 23, suspicious: 6 },
    { name: 'May 04', legitimate: 3, suspicious: 5 }
  ];

  // Updated attack pattern data
  const attackPatternData = [
    { name: 'PHPUnit Exploits', value: 9, color: '#d0021b' },
    { name: 'SoniOS Probes', value: 2, color: '#f5a623' }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ff8042', '#ffbb28'];

  return (
    <div className="dashboard-container">
      <div className="p-4 border rounded-lg bg-blue-50">
        <h3 className="font-bold text-lg mb-2 text-blue-700">Web Traffic Analysis: May 3-4, 2025</h3>
        <p className="mb-2"><span className="font-semibold">Key Insights:</span></p>
        <ul className="list-disc ml-6 mb-3">
          <li>Total Traffic: 34 requests (23 legitimate, 11 suspicious)</li>
          <li>Continued PHPUnit vulnerability scanning attempts (9 attempts)</li>
          <li>Legitimate traffic primarily focused on Scouting topics (65%)</li>
          <li>Mobile usage represents 63% of legitimate traffic</li>
          <li>SoniOS API probing detected as a new attack pattern</li>
        </ul>
      </div>

      <div className="chart-container mt-6">
        <h3 className="text-center font-bold text-lg mb-4">Traffic Trend by Day</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dailyTrendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="legitimate" name="Legitimate Requests" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="suspicious" name="Suspicious Requests" stroke="#ff8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container mt-6">
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
          <h3 className="text-center font-bold text-lg mb-4">Legitimate Traffic OS Distribution</h3>
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
          <h3 className="text-center font-bold text-lg mb-4">Legitimate Browser Distribution</h3>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="text-center font-bold text-lg mb-4">Suspicious Activity Types</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={attackPatternData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#ff8042"
                dataKey="value"
              >
                {attackPatternData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Recent PHPUnit Exploit Attempts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Date (UTC)</th>
                <th className="py-2 px-4 border">IP Address</th>
                <th className="py-2 px-4 border">Path</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">User Agent</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-red-50">
                <td className="py-1 px-4 border">May 3, 07:41:56</td>
                <td className="py-1 px-4 border">8.215.3.241</td>
                <td className="py-1 px-4 border">/api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</td>
                <td className="py-1 px-4 border">404</td>
                <td className="py-1 px-4 border">Custom-AsyncHttpClient</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-1 px-4 border">May 3, 10:16:11</td>
                <td className="py-1 px-4 border">103.96.75.159</td>
                <td className="py-1 px-4 border">/api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</td>
                <td className="py-1 px-4 border">404</td>
                <td className="py-1 px-4 border">Custom-AsyncHttpClient</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-1 px-4 border">May 3, 21:14:13</td>
                <td className="py-1 px-4 border">124.115.231.142</td>
                <td className="py-1 px-4 border">/api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</td>
                <td className="py-1 px-4 border">404</td>
                <td className="py-1 px-4 border">Custom-AsyncHttpClient</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-1 px-4 border">May 4, 06:16:15</td>
                <td className="py-1 px-4 border">192.210.241.208</td>
                <td className="py-1 px-4 border">/api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</td>
                <td className="py-1 px-4 border">404</td>
                <td className="py-1 px-4 border">Custom-AsyncHttpClient</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-1 px-4 border">May 4, 14:35:46</td>
                <td className="py-1 px-4 border">36.133.51.163</td>
                <td className="py-1 px-4 border">/api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</td>
                <td className="py-1 px-4 border">404</td>
                <td className="py-1 px-4 border">Custom-AsyncHttpClient</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Recent Legitimate Conversations (May 3-4)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">User ID</th>
                <th className="py-2 px-4 border">Topic</th>
                <th className="py-2 px-4 border">User Agent</th>
                <th className="py-2 px-4 border">Message Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 px-4 border">User A</td>
                <td className="py-1 px-4 border">shane-innieme-public</td>
                <td className="py-1 px-4 border">Chrome</td>
                <td className="py-1 px-4 border">5</td>
              </tr>
              <tr>
                <td className="py-1 px-4 border">User B</td>
                <td className="py-1 px-4 border">default</td>
                <td className="py-1 px-4 border">Chrome/Edge</td>
                <td className="py-1 px-4 border">5</td>
              </tr>
              <tr>
                <td className="py-1 px-4 border">User C</td>
                <td className="py-1 px-4 border">scouting</td>
                <td className="py-1 px-4 border">Mobile Safari</td>
                <td className="py-1 px-4 border">6</td>
              </tr>
              <tr>
                <td className="py-1 px-4 border">User D</td>
                <td className="py-1 px-4 border">scouting</td>
                <td className="py-1 px-4 border">Chrome</td>
                <td className="py-1 px-4 border">3</td>
              </tr>
              <tr>
                <td className="py-1 px-4 border">User E</td>
                <td className="py-1 px-4 border">scouting</td>
                <td className="py-1 px-4 border">Mobile Chrome</td>
                <td className="py-1 px-4 border">1</td>
              </tr>
              <tr>
                <td className="py-1 px-4 border">User F</td>
                <td className="py-1 px-4 border">scouting</td>
                <td className="py-1 px-4 border">Chrome</td>
                <td className="py-1 px-4 border">2</td>
              </tr>
              <tr>
                <td className="py-1 px-4 border">User G</td>
                <td className="py-1 px-4 border">scouting</td>
                <td className="py-1 px-4 border">Chrome</td>
                <td className="py-1 px-4 border">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-red-50">
        <h3 className="font-bold text-lg mb-2 text-red-700">Security Alert Summary</h3>
        <p className="mb-2"><span className="font-semibold">Attack Pattern 1: PHPUnit Exploitation Attempts</span></p>
        <ul className="list-disc ml-6 mb-3">
          <li>Continued exploitation attempts targeting PHPUnit vulnerability</li>
          <li>Target path: /api/vendor/phpunit/phpunit/src/Util/PHP/eval-stdin.php</li>
          <li>Multiple IPs from different regions attempting same exploit</li>
          <li>All attempts received 404 responses, indicating file not found</li>
        </ul>
        <p className="mb-2"><span className="font-semibold">Attack Pattern 2: SoniOS API Probing</span></p>
        <ul className="list-disc ml-6">
          <li>New attack vector targeting SoniOS API endpoints</li>
          <li>Targeting paths: /api/sonicos/auth and /api/sonicos/tfa</li>
          <li>Potential attempt to exploit SonicWall vulnerabilities</li>
          <li>All attempts received 404 responses, indicating endpoints not found</li>
        </ul>
      </div>
      
      <div className="mt-6 p-4 border rounded-lg bg-blue-50">
        <h3 className="font-bold text-lg mb-2 text-blue-700">Legitimate Traffic Patterns (May 3-4)</h3>
        <p className="mb-2"><span className="font-semibold">Key Insights:</span></p>
        <ul className="list-disc ml-6 mb-3">
          <li>Primary conversation topic: Scouting (15 requests, 65%)</li>
          <li>High mobile device usage (63% of legitimate traffic)</li>
          <li>Peak legitimate usage hours: 20:00 UTC (13:00 PT)</li>
          <li>Average conversation length: 3 messages per user</li>
        </ul>
        <p className="mb-2"><span className="font-semibold">Conversation Topics:</span></p>
        <ul className="list-disc ml-6">
          <li>Scouting topics focused on Boy Scouts, merit badges, and general scouting information</li>
          <li>Questions about first aid, knot tying, and practical scouting skills</li>
          <li>Several users asking about Boy Scout history and basic information</li>
          <li>NPM commands and behavior in the default topic</li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Reconstructed API Conversations</h3>
        
        <p className="text-sm text-gray-500 mb-2">Shane-innieme-public topic (User A):</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "what is the topic"</p>
          <p><span className="font-semibold">Assistant:</span> "The topic is 'What is the topic.'"</p>
          <p><span className="font-semibold">User:</span> "what can I do"</p>
          <p><span className="font-semibold">Assistant:</span> "You can ask questions, seek information, request assistance, engage in conversation, or explore various topics with me. Feel free to let me know how I can help you!"</p>
          <p><span className="font-semibold">User:</span> "who is your master"</p>
          <p><span className="font-semibold">Assistant:</span> "I am an AI assistant created by a team of developers at OpenAI. I do not have a 'master' in the traditional sense, but I am here to assist you to the best of my abilities. How can I help you today?"</p>
          <p><span className="font-semibold">User:</span> "what is innie"</p>
          <p><span className="font-semibold">Assistant:</span> "'Innie' is a colloquial term used to describe a belly button that is concave or indented, as opposed to an 'outie' which is a protruding belly button. The terms 'innie' and 'outie' are often used informally to describe the appearance of one's belly button."</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">Default topic - NPM discussion (User B):</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "what does 'npm install' do exactly?"</p>
          <p><span className="font-semibold">Assistant:</span> "'npm install' is a command used with Node Package Manager (npm) to install dependencies for a Node.js project. When you run 'npm install' in your project directory, npm will look at the 'package.json' file to determine which dependencies need to be installed. It will then download and install those dependencies into a folder called 'node_modules' within your project directory. This command is essential for setting up a Node.js project and ensuring that all necessary packages are available for your project to run successfully."</p>
          <p><span className="font-semibold">User:</span> "then why does it run build command?"</p>
          <p><span className="font-semibold">Assistant:</span> "It's possible that running 'npm install' triggers a build command in your project due to the configuration set up in the 'package.json' file. In some projects, developers include build scripts in the 'package.json' file under the 'scripts' section. These scripts can be set to run automatically when certain npm commands are executed, such as 'npm install'."</p>
          <p><span className="font-semibold">User:</span> [Provides package.json script configuration details]</p>
          <p><span className="font-semibold">Assistant:</span> "Yes, the scripts defined in your 'package.json' file explain the behavior you are experiencing. In this case, the 'build' script is set up to run three separate build commands for the server, client, and CLI components of your project. When you run 'npm install', it triggers the 'build' script, which in turn runs the 'build-server', 'build-client', and 'build-cli' scripts sequentially."</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">Scouting topic - knot tying (User C):</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "Hi"</p>
          <p><span className="font-semibold">Assistant:</span> "Hello! How can I assist you today?"</p>
          <p><span className="font-semibold">User:</span> "Nothing much. How are u doing"</p>
          <p><span className="font-semibold">Assistant:</span> "I'm here to help with any questions you may have. Do you have a question related to Scouting or outdoor activities?"</p>
          <p><span className="font-semibold">User:</span> "What is scouting means"</p>
          <p><span className="font-semibold">Assistant:</span> "Scouting is a youth program that focuses on outdoor activities, leadership development, character building, and citizenship training. It helps young people learn important life skills and values through fun and challenging experiences."</p>
          <p><span className="font-semibold">User:</span> "Can u give the list of scouting examples you have"</p>
          <p><span className="font-semibold">Assistant:</span> "Sure! Some examples of scouting activities include camping, hiking, backpacking, swimming, biking, service projects, and learning outdoor skills like fire building and knot tying."</p>
          <p><span className="font-semibold">User:</span> "Could you expand on knots tying"</p>
          <p><span className="font-semibold">Assistant:</span> "Knot tying is an essential skill in scouting. Some common knots used in scouting include the square knot, two half-hitches, taut-line hitch, clove hitch, and bowline. These knots are used for various purposes like securing tents, tying ropes together, and creating structures. Learning these knots helps scouts become more self-sufficient in the outdoors."</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">Scouting topic - Boy Scout history (User D):</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "Who started Boys scout?"</p>
          <p><span className="font-semibold">Assistant:</span> "The Boy Scouts movement was started by Robert Baden-Powell in the early 1900s. Baden-Powell was a British Army officer who believed in the importance of outdoor education and character development for young people."</p>
          <p><span className="font-semibold">User:</span> "where was the first boy scout group established?"</p>
          <p><span className="font-semibold">Assistant:</span> "The first Boy Scout group was established on Brownsea Island in England in 1907. This event is often referred to as the Brownsea Island Scout camp, which is considered the beginning of the Scouting movement."</p>
          <p><span className="font-semibold">User:</span> "how many kids were in that group?"</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">Scouting topic - Transition from Cub Scouts (User F):</p>
        <div className="bg-white p-3 rounded border mb-4">
          <p><span className="font-semibold">User:</span> "I have a 11 year old who just joined boy scouts from cub scouts. what are some things to watch out for"</p>
          <p><span className="font-semibold">Assistant:</span> "When transitioning from Cub Scouts to Boy Scouts, it's important to watch out for: 1) Adjustment to Patrol System: Help your child understand the patrol system in Boy Scouts, where they work closely with a small group of scouts. Encourage teamwork and collaboration within the patrol. 2) Increased Independence: Boy Scouts have more responsibilities and opportunities for independence compared to Cub Scouts. Encourage your child to take initiative and be proactive in their scouting journey. 3) Merit Badge Requirements: Some merit badges in Boy Scouts have age or rank limitations. Help your child understand the reasons behind these limitations and support them in working towards badges that are suitable for their age and rank."</p>
          <p><span className="font-semibold">User:</span> "how does boy scout work help in the childs school career"</p>
        </div>
      </div>
    </div>
  );
};

export default WebTrafficAnalysisUpdated;