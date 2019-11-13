// immer와 mobx
//기존 classComponent 를 사용하는 connect(기존방식), reducer를 편하게 쓰는 immer를 알아보자

//우선 기존의 코드를 class로 바꿔보자

//App.jsx 에서 
//**Hooks에서는 state, dispatch 부분이 Hooks 안에서 만들어진다 (state는 useSelector()로 가져오고)(chap2 App.jsx)
//**Class에서는 state, dispatch 부분을 다른 곳에서 가지고 와서 두 부분을 connect에 작성해줘야 한다(chap3 App.jsx)

//Hooks
import { useDispatch, useSelector } from 'react-redux';
const App = () => {
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
}
export default App; //App안에서 만들어져서 한번에 보낸다

//Class
class App extends Component {}
const mapStateToProps = (state) => ({ //state 따로 (App클래스와 떨어져있음)
  user: state.user, //보통은 filter(state.user) 이런식으로 함수를 이용하여 원하는 정보만 얻는다
  posts: state.posts,
}); // reselect (위의 함수기능(filter같은)을 사용할 때 매번 랜더링 될때마다 이 함수가 실행되기 때문에 
//성능상 문제를 극복하기 위해 reselect를 사용한다) 참고로 Hooks는 reselect가 필요없다
const mapDispatchToProps = (dispatch) => ({   //dispatch 따로 (App클래스와 떨어져있음)
  dispatchLogIn: (data) => dispatch(logIn(data)), //logIn() 이 action creator 이다
  dispatchLogOut: () => dispatch(logOut()),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);  //state와 dispatch를 App 클래스와 연결시킨다

//**mapStateToProps() 는 리덕스 state -> 컴포넌트 props로 만드는 것이고
//**mapDispatchToProps() 는 리덕스 dispatch -> 컴포넌트 컴포넌트 props로 만드는 것이다
//함수에서 이미 dispatch를 하고 난뒤에 App 클래스 안에서 사용되기 때문에 this.props.dispatchLogIn() 
//즉 this.props로 함수에 접근하는 것이다
class App extends Component {
  onClick = () => {
    this.props.dispatchLogIn({
      id: 'zerocho',
      password: '비밀번호',
    });
  };


//위의 Class에서 state를 바꾸려고 할 때 아래와 같이 객체로 묶여 있기 때문에 하나만 수정하고 싶더라도 잘 조정해야하지만
const mapStateToProps = (state) => ({ user: state.user, posts: state.posts,});
//Hooks는 state를 바꾸려고 할 때 아래와 같이 state별로 호출하면 된다
const user = useSelector((state) => state.user);


//리액트는 컴포넌트, 컨테이너로 나누는데 데이터를 가져오는 컴포넌트를 컨테이너라고 한다
//아래의 예가 컨테이너 컴포넌트라고 보면 된다
const App = () => {
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();


//immer 
//아래와 같은 구조의 state 데이터가 있다고 가정할때 
state.deep.deeper.deepest.a = 'b';
//리액트에서는 불변성을 유지하기 위해 아래와 같은 코드를 쓴다
return {
  ...prevState,
  data: null,
  deep: {
    ...prevState,
    deeper: {
      ...prevState,
      deepest:{
        ...prevState,
        a: 'b',
      }
    } 
  }
}
//위의 복잡한 과정을 쉽게 해주는 라이브러리가 immer이다

//reducer의 역할 action 을 dispatch 했을 때 그 action 을 바탕으로 다음 state를 만들어낸다 
//이전 state와 action을 받아서 다음 state를 만들어 내는 함수가 reducer이다

//immer도 이전 state를 바탕으로 action을 받아서 다음 state를 만들어낸다(아래가 immer의 기본 형태?이다)
const producer = require('immer');
nextState = producer(prevState, (draft) => {}) //이전 state(prevState)를 받아 다음 state(nextState)를 만든다
//여기서 draft는 prevState의 복사본 같은것이라 직관적으로 draft.data = null; draft.isLoggingIn = true; 이런식으로
//바꿀 수 있다(복사부분을 immer가 대신 해주기 떄문에 쉽게 불변성을 유지할 수 있다)
//아래처럼 기존의 userReducer안의 switch문을 produce() 함수 안에 넣어주면 된다
const userReducer = (prevState = initialState, action) => { 
  return produce(prevState, (draft) => { //이렇게 넣어 주고 
    switch (action.type) {
      case 'LOG_IN_REQUEST':
        draft.data = null;              //draft 로 직관적으로 데이터에 접근하면 된다(initialState에 바로접근)
        draft.isLoggingIn = true;
        break;
      case 'LOG_IN_SUCCESS':
        .....
    }
  }
}
//**chap2에선 return을 {} 해줬는데 immer는 draft가 prevState를 가르키고 prevState는 initialState를 
//가르키기 때문에 그냥 객체에 바로 대입하면 되고, 대신 break를 적어줘야 한다

//[] 배열 형태일땐 [...prevState, action.data] 를 사용했는데
//immer를 사용하면 draft.push(action.data) 를 사용하면 된다
//(제로초 react-nordbird/ch6/front/reducers/post.js 코드를 보면 기존의 코드를 볼 수 있고,
// react-nordbird/ch7/front/reducers/post.js 코드를 보면 immer를 적용시킨 코드를 볼 수 있다)

//immer는 require로 불러오는 것이랑 import로 불러오는 것이랑 다르다
const { produce } = require('immer');
import produce from 'immer';

//require와 import 모두 불러오는 것이지만 default 부분에서 불러오는 방식이 약간 다르다