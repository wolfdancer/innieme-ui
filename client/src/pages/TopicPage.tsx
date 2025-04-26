import { useParams } from 'react-router-dom';
import '../index.css'
import App from '../App';

const TopicPage = () => {
  const { topic_id } = useParams();

  return (
    <div>
      <h1>Topic {topic_id}</h1>
      <App topic_id={topic_id} />
    </div>
  );
};

export default TopicPage;