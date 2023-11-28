
const initalState = {
    
    currentUser: {
    id: null,
    name: null,
    email: null,
    events: [],
    isActive: null }
};

  let copyState = null;
  let index = 0;
  
  const userReducer = (state = initalState, action) => {
    const {type, payload} = action;
  
    switch (type) {
      case 'SET_USER':
        console.log('payload', payload);
        return {
          ...state,
          currentUser: {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            events: payload.events,
            isActive: payload.isActive
          }
    };
      default:
        return state;  
    }  

}

    export default userReducer