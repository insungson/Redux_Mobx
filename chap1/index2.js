const {createStore} = require('redux');

const reducer = (prevState, action) => {
  switch(action.type){
    case 'LOG_IN':
      return {
        ...prevState,
        user: action.data,
      };
    case 'LOG_OUT':
      return {
        ...prevState,
        user: null,
      };
    case 'ADD_POST':
      return {
        posts: [...prevState.posts, action.data], //이전 state객체 부분얕은 복사
      };
    default:
      return prevState;
  }
};

const initialState = {
  user : null,
  isLoggingIn : true,
  posts : [],
  comments : [],
  favorites : [],
  history : [],
  likes: [],
  followers : [],
};

const store = createStore(reducer, initialState);
store.subscribe = (() => {
  console.log('changed');
});

console.log('1st', store.getState());

const logIn = (data) => {
  return { //action
    type: 'LOG_IN',
    data
  };
};

const logOut = () => {
  return {//action
    type: 'LOG_OUT',
  };
};

const addPost = (data) => {
  return {
    type: 'ADD_POST',
    data,
  };
};

//------------------------------- 위는 미리 만들어 놓을것, 아래는 실행시 만들어 둘 것

store.dispatch({ //이건 다이렉트로 dispatch를 사용한것
  type: 'LOG_IN_REQUEST',
});

store.dispatch(logIn({ //이건 함수를 한번 거쳐서 dispatch를 사용한것
  id: 1,
  name: 'Sonny',
  admin: true,
}));

console.log('2nd', store.getState());

store.dispatch(addPost({
  userId: 1,
  id: 1,
  content: '안녕하세요. 리덕스',
}));

console.log('3rd', store.getState());

store.dispatch(addPost({
  userId: 2,
  id: 2,
  content: '두번째 리덕스',
}));

console.log('4th', store.getState());

store.dispatch(logOut());

console.log('5th', store.getState());