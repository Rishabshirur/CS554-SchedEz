
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import UpdateProfile from './UpdateProfile';
function Account() {
  return (
    <div className='card'>
      <h2>Account Page</h2>
      <ChangePassword />
      <UpdateProfile/>
    </div>
  );
}

export default Account;