import actions from "../actions";

const initalState = {
    currentUser: {
    id: '',
    name: '',
    email: '',
    events: [],
    isActive: false 
  },
};
const imageLink = '';
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

const image = (image = imageLink,action) => {
  const {type, payload} = action;

  switch (type) {
    case 'SET_IMAGE':
      return {
        ...image,
        image: payload.image
  };
    default:
      return image;  
  }  
}

export {userInfo,image}