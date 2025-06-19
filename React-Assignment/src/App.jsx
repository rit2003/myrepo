import UserCard from './UserCard';
import InteractiveComponents from './InteractiveComponents';

function App() {
  const user = {
    name: 'Ritika Chandak',
    email: 'ritikachandak2003@gmail.com',
    location: 'Indore, India',
  };

  return (
    <div>
      <h2>Assignment 1: User Profile Card Components</h2>
      <UserCard user={user} />
      <br></br>
      <h2>Assignment 2: Components with State and Event Handling</h2>
      <InteractiveComponents />
    </div>
  );
}

export default App;
