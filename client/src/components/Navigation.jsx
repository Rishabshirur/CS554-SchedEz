import {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import SignOutButton from './SignOut';
import {useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import '../App.css';

const Navigation = () => {
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  // const {currentUser} = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(null);
  // console.log(currentUser)
  let auth = getAuth();
  console.log("imagemagick in docker",auth.currentUser.photoURL);
  useEffect(() => {
    setProfilePicture(auth.currentUser.photoURL)
  },[auth.currentUser.photoURL]);


  return (
    <nav className='navigation'>
      {auth.currentUser && auth.currentUser.photoURL && (
          <div className='profile-picture'>
          <img
            src={`http://localhost:3000${profilePicture}`}
            alt="Profile"
            style={{ width: '50px', height: '50px' }}
          />
        </div>
        )}
      <ul>
        {/* <li>
          <NavLink to='/'>Landing</NavLink>
        </li> */}
        <li>
          <NavLink to='/home' className='nav-link'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/account' className='nav-link'>Profile</NavLink>
        </li>

        <li>
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className='navigation'>
      <ul>
        <li>
          <NavLink to='/'>Landing</NavLink>
        </li>
        <li>
          <NavLink to='/signup'>Sign-up</NavLink>
        </li>

        <li>
          <NavLink to='/signin'>Sign-In</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;


// import { useContext } from 'react';
// import { NavLink } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import SignOutButton from './SignOut';
// import '../App.css';

// const NavigationAuth = () => {
//   const { currentUser } = useContext(AuthContext);

//   return (
//     <nav className='navigation'>
//       <ul>
//         <li>
//           <NavLink to='/home'>Home</NavLink>
//         </li>
//         <li>
//           <NavLink to='/account'>Profile</NavLink>
//         </li>
//         <li>
//           <SignOutButton />
//         </li>
//         {/* Display the profile picture if available
//         {currentUser.profilePicture && (
//           <li className='profile-picture'>
//             <img src={currentUser.profilePicture} alt="Profile" />
//           </li>
//         )} */}
//       </ul>
//     </nav>
//   );
// };

// export default NavigationAuth;
