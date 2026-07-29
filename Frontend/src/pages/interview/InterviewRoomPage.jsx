import { useLocation, useParams } from 'react-router-dom';
import InterviewRoom from '@/components/interview/InterviewRoom';

export default function InterviewRoomPage() {
  const location = useLocation();
  const { sessionId: paramSessionId } = useParams();

  const session = location.state?.session || null;
  const sessionId = session?.sessionId || paramSessionId || '';

  return (
    <InterviewRoom
      sessionId={sessionId}
      sessionDetails={session}
    />
  );
}
