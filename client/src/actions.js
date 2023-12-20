const setUser = (id, name, email ,events ,isActive) => ({
    type: 'SET_USER',
    payload: {
      id: id,
      name: name,
      email: email,
      events: events,
      isActive: isActive
    }
  });

  const unsetUser = () => ({
    type: 'UNSET_USER',
  });

  const setImage = (image) => ({
    type: 'SET_IMAGE',
    payload: {
      image: image
    }
  });
export default {setUser, unsetUser,setImage}