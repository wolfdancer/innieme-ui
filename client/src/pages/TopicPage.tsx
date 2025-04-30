import { useParams, useLocation } from 'react-router-dom';
import '../index.css'
import App from '../App';

const TopicPage = () => {
  const { topic_id } = useParams();
  const location = useLocation();
  
  // Extract the full topic path
  // For a URL like /topics/workday/2025/separation
  // This will give us "workday/2025/separation"
  const fullTopicId = topic_id 
    ? decodeURIComponent(topic_id).replace(/\/+$/, '') 
    : decodeURIComponent(location.pathname.replace('/topics/', '').replace(/\/+$/, ''));

  return (
    <div>
      <h1>Topic {fullTopicId}</h1>
      <App 
        topic_id={fullTopicId}
      />
    </div>
  );
};

export default TopicPage;