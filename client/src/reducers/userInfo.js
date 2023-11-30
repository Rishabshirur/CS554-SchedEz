
const initalState = {
    currentUser: {
    id: '',
    name: '',
    email: '',
    events: [],
    isActive: false 
  },
};

  // let copyState = null;
  // let index = 0;
  
  const userInfo = (state = initalState, action) => {
    const {type, payload} = action;
  
    switch (type) {
      case 'SET_USER':
        return {
          ...state,
          currentUser: {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            events: payload.events,
            isActive: payload.isActive
          },
    };

    case 'UNSET_USER':
        return {
          ...state,
          currentUser: {
            id: '',
            name: '',
            email: '',
            events: [],
            isActive: false
          },
    };
      default:
        return state;  
    }  

}

export default userInfo