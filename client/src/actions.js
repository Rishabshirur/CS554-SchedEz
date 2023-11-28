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

export default setUser