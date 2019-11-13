const {produce} = require('immer'); //불변성 유지를 위해 객체를 얕은 복사할 코드를 대신해주는 라이브러리

const initialState = [];

const postReducer = (prevState = initialState, action) => {
  return produce(prevState, (draft) => { //draft를 통해서 얕은 복사를 대신해준다
    switch(action.type){
      case 'ADD_POST':
        draft.push(action.data);
        break;
      default: 
        break;
    }
  });
};

module.exports = postReducer;