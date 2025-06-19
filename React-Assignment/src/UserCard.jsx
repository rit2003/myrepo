import UserDetails from './UserDetails';

function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <UserDetails email={user.email} location={user.location} />
    </div>
  );
}

export default UserCard;
