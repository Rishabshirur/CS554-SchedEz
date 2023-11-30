import { useSelector } from 'react-redux';
import EventList from './EventList';

function EventListingPage() {
  const currentUser = useSelector((state) => state.userInfo.currentUser);

  const userId = currentUser.userId;

  return (
    <div>
      <h1>Event Listing Page</h1>
      <EventList userId={userId} />
    </div>
  );
}

export default EventListingPage;
