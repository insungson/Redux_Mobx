const {createStore} = require('redux');

const reducer = (prevState, action) => { //불변성 유지를 위한 prevState로 새로운 state만들어줌
  switch(action.type){
    case 'CHANGE_COMP_A':
      return {
        ...prevState,
        compA:action.data,
        // compB:12,  ...prevState 로 얕은 복사를 했기 때문에 더이상 중복은 필요없다
        // compC:null,
      };
    case 'CHANGE_COMP_B':
      return {
        ...prevState,
        compB:action.data,
      };
    default : //dispatch() 에서 type 을 적을때 오타가 날 경우
      return prevState; //state;  reducer() 함수가 새로운 state를 만드는 것이므로 state를 리턴해준다
  }
};


const initialState = {
  compA : 'a',
  compB : 12,
  compC : null,
};

const store = createStore(reducer,initialState);
store.subscribe(() => { //react-redux 안에 들어있음
  console.log('changed'); // 화면을 바꿔주는 코드를 여기 넣음 (subscribe는 보통 에러 디버깅용으로 사용)
});

console.log('1st',store.getState());

//action (주의할점은 함수가 액션이 아니라 return 해주는 {}객체가 액션이다!!)
const ChangeComA = (data) => {
  return {
    type: 'CHANGE_COMP_A',
    data,
  };
};

store.dispatch(ChangeComA('b'));
//store.dispatch({type: 'CHANGE_COMP_A', data:'b'})  와 같은 것이다

console.log('2nd', store.getState());



