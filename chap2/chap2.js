//목록
//1. 리덕스 폴더구조 잡는법
//2. 리덕스 비동기
//3. 미들웨어 사용방법, 리액트 적용방법

//2-1. 리덕스 폴더 구조
//chap1에서 만들었던 index2.js 를 분리해보자 
//(분리가 쉬운 이유는 순수함수(매개변수,함수내부에서 선언한 변수를 빼고 다른것을 참조하지 않는함수)이기 때문이다)

//기존의 index.js에서 action, reducer 부분을 나눠서 따로 폴더를 만들어 관리하자
// actions 폴더에서도 사용자, 게시글에 대한 action들을 구분해서 코드를 관리하는게 좋다
//분리하는 기준은 데이터이다! (리덕스에서 구분하는 기준은 데이터이다)
//예를 들면 initialState 에서 사용자, 게시글 의 속성에 따라 구분해 준다
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
//리덕스에서 가장 중요한것은 위의 초기 state구조를 잘 짜줘야 한다는 것이다 구조로 action과 reducer를 나누기 때문이다

//** 아래와 같이 게시글에 덧글을 넣는게 이론상으로 맞지만... 댓글을 추가할때마다 이중구조가 되기 때문에 
posts : [
  {comments : [],}
],
// 아래와 같은 구조가 되어버리므로 나중에 덧글 하나만 가져올때도 posts를 거쳐서 가져와야 하기 때문에 복잡해진다
posts : [
  {comments : [],
   comments : [],
   comments : [],
  }
],
//그래서 그냥 덧글 데이터를 따로 빼놓는 것이다(이런 구분은 프로젝트에 따라 다르다)



///////////////////////////////////////////////////
//2-2. combineReducers
//이제 reducer부분을 쪼개보자
//reducer는 switch문으로 이뤄진 함수이기 때문에 그냥 쪼갤순 없다
//redux에서 제공하는 combineReducers()를 사용해서 쪼개보자
//** 참고로 combineReducer()에서 user, posts는 initialState의 user,posts 와 같게 바꾼다
//(HOOKS의 state, setState() 와 비슷하게 state하나당 reducer를 설정한다고 보면 된다(사후관리가 용이하다))
module.exports = combineReducers({
  user: userReducer,
  posts: postReducer,
});
//위처럼 state별로 구분을 하면 기존의 아래코드를
case 'ADD_POST':
    return {
      posts: [...prevState.posts, action.data], //이전 state객체 부분얕은 복사
    };
//이렇게 바꿀수 있다
//그리고 state의 구조를 일치시켜야 하기 때문에 const initialState = []; 작업을 해준다
//(기존의 ...prevState가 initialState를 가르켰다면, 직접구분을 해서 initialState.posts를 가르키기 때문이다)
//(그래서 posts: 부분도 없어졌다)
const initialState = [];//데이터구조일치로 이걸 넣어줌
const postReducer = (prevState = initialState, action) => { // 새로운 state 만들어주기
  switch (action.type) {
    case 'ADD_POST':
      return [...prevState, action.data]; //이부분에서 prevState를 그냥 가져오는부분이 바뀌었다
    default:
      return prevState;
  }
};

////////////////////////////////////////////
//2-3. 리덕스 미들웨어
//action은 기본적으로 동기이다. dispatch는 그냥 action을 실행하는것이기 때문에 비동기가 들어갈 틈이 없다
//미들웨어는 dispatch - reducer 사이에 위치해서 동작한다 (chap1.js 에서 그림을 보면서 이해해 보자)

//아래와 같이 store의 3번째 인자로 enhancer를 주고 그안에 미들웨어를 넣는 것이다
const store = createStore(reducer, initialState, enhancer);

//아래같이 enhancer에 미들웨어를 넣어주는데 compose()는 미들웨어 함수들을 합성해준다
//(나중에 devtool도 추가하여 applyMiddleware 와 합성을 한다)
//그리고 compose, applyMiddleware는 redux에 들어있다
const enhancer = process.env.NODE_ENV === 'production'
  ? compose(
    applyMiddleware(
      firstMiddleware,
      thunkMiddleware,
    ),
    devtool, //redux에서 나오는 action과 dispatch되는 것들, state들을 편하게 볼수 있는 chrome 확장 프로그램이다
  )     
  : composeWithDevTools(
    applyMiddleware(
      firstMiddleware,
      thunkMiddleware,
    ),
  );

//그리고 fistMiddelware처럼 미들웨어를 추가할때 아래와 같이 고차함수를 써야한다
//미들웨어를 구성할때의 기본방법(와꾸)이라 생각하자
const firstMiddleware = (store) => (next) => (action) => {
  console.log('로깅', action);
  next(action);
};
//참고로 위의 구조는 아래같은 콜백 구조와 같다
//그리고 고차함수로 나눈이유는 store - next(dispatch라고 생각하자) - action 사이에 어떤 작업을 하고 
//싶을때 로직을 넣기 위해서 고차함수로 표현된 것이다
//위의 구조는 store - next - action 사이에 어떤 로직 필요없이 한방에 store - action을 사용하기 위해 고차함수로
//쓴 것이다
function firstMiddleware(store){
  //로직(store-next 사이)
  return function(next){
    //로직(next-action 사이)
    return function(action){
      //로직(action)
    }
  }
}

//**미들웨어의 사용방법은 아래와 같이 dispatch()로 액션을 실행하기 이전 이후에 로직을 넣는것이다
//아래의 코드에선 dispatch가 action을 실행하기 전에 콘솔로 action을 찍는것만 했다
const firstMiddleware = (store) => (dispatch) => (action) => { //이런 삼단 방식을 커링방식이라 한다(확장성좋음)
  console.log(action);
  //기능추가
  dispatch(action); //action을 실행한다
  //기능추가
} 



///////////////////////////////////////////////////////
//2-4. redux-thunk
//리덕스에서 비동기를 제어하는 미들웨어 중 유명한게 thunk 와 saga 이다
//아래가 리덕스에서 미들웨어를 만들때의 기본구조이다 
const thunkMiddleware = (store) => (dispatch) => (action) => {
  return dispatch(action); //동기
}
//thunk는 여기에 비동기방식으로 작동하기 위해 하나를 추가해준다
//조건문을 만들고 비동기인 경우는 action을 함수로 만들어준다
//원래 action은 객체구조이지만 thunk를 이용할땐 함수로 만들어준다(아래는 redux thunk의 기본구조이다)
const thunkMiddleware = (store) => (dispatch) => (action) => {
  if(typeof action === 'function'){ //비동기
    return action(store.dispatch, store.getState);  //action이 {type, data} 형태이므로 형태에 맞게 
  }                                                //store객체를 통해 바로 넣은 것이다
  return dispatch(action); //동기
}
//그리고 return action(store.dispatch, store.getState); 의 리턴 action은 
//action부분 코드에서 실행된다 
//**기존의 코드는 action을 객체로 리턴하는 방식으로 아래와 같다(그리고 전부 동기 방식이다)
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
//이제 아래와 같이 함수형으로 비동기 액션을 만들어주자
const logInRequest = () => {
  return (dispatch, getState) => { //** 비동기 방식이기 때문에 함수를 리턴해야한다!!
    //로직
  }; 
}
//thunkMiddleWare에서 함수일때 리턴을 해준 action(store.dispatch, store.getState); 코드와 위의 리턴이
//같다고 생각하면 된다 (참고로 action(store.dispatch, store.getState);의 매개변수는 커스터마이즈 된다)

//아래와 같이 비동기 방식의 함수를 만들어보자
//결국 동기식 함수(logInRequest,logInSuccess) 를 비동기방식으로 구현한 것이다
const logIn = (data) => {
  return (dispatch,getState) => {//action부분인 return에 함수로 비동기적으로 구현한다
    dispatch(logInRequest(data)); //요청을 하고 2초 뒤에 로그인이 되었다는 코드를 만듬
    try{
    setTimeout(() => {
      dispatch(logInSuccess({ //로긴이 성공할때 객체 데이터를 넘겨준다
        userId: 1,
        nickname: 'SON',
      }));
    }, 2000);
    }catch(e){
      dispatch(logInFailure(e));  //보통 try catch로 이렇게 잡는다
    }
  };
}
//비동기 방식으로 만들려면 Request, Success, Failure 3개는 만들어줘야 체크가 가능하다
const logInRequest = (data) => {
  return {type:'LOG_IN_REQUEST',data,};
}
const logInSuccess = (data) => {
  return {type:'LOG_IN_SUCCESS', data,};
}
const logInFailure = (error) => {
  return {type:'LOG_IN_FAILURE', error,}
}

//thunk는 동기들을 모아서 비동기적 작업을 해주는 것이다
//복잡한 비동기적 작업을 하려면 redux saga를 사용해야 한다


////////////////////////////////////////////////
//2-5. react-redux
//이제 로긴 하는 화면을 보자
//redux - react를 연결하려면 react-redux 를 설치해야한다(내부적으로 store.subscribe를 하고 있다)
//redux에서 hooks도 지원이 된다
//https://react-redux.js.org/     리액트/리덕스 공식 문서도 같이 보자


//**아래와 같이 리듀서의 액션 부분을 변수로 따로 빼놓는데.. 이유는 오타로 인한 에러를 줄여준다
//예를 들면 변수를 따로 빼놓지 않고 아래의 logIn에서 type에 직접 LOGLN 으로 오타로 입력할 경우
//reducer의 case가 일치하지 않아 오류가 생기지만.. 찾기가 매우 힘들다.. 그러므로 위에 따로 변수를 빼서 관리하면
//오타로 인한 에러를 미연에 방지할 수 있다
const LOG_IN = 'LOG_IN'

const logIn = (data) => {
  return { //action
    type: 'LOG_IN',
    data
  };
};
//-------------------- 아래의 부분도 변수로 사용가능하다
const reducer = (prevState, action) => {
  switch(action.type){
    case LOG_IN: //변수 사용
      return {
        ...prevState,
        user: action.data,
      };
//**위의 경우처럼 하나의 값이 있고 이 값을 여러군데서 사용한다면 변수,상수로 따로 묶어서 관리하면 에러를 줄일 수 있다

//리덕스 devtools에서는 동기action들만 기록된다

//아래처럼 컴포넌트 안에서 비동기처리를 해도 된다
//(다만 이렇게처리하면 컴포넌트가 복잡해지기 때문에 코드 관리차원에서 액션 실행시 비동기실행 코드를 넣어주는게 좋다)
const onClick = useCallback(() => {
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(logInSuccess({
          userId: 1, nickname: 'zerocho'
        }));
      }, 2000);
    } catch (error) {
      dispatch(logInFailure(e));
    }
  },[],
);
//아래가 기존의 코드이다
const onClick = useCallback(() => {
  dispatch(logIn({
    id:'Son', password:'비밀번호'
  }));
},[],);

//그래서 176번째 줄처럼 action에서 비동기 관리를 하는 것이다 (중복 및 코드가 깔끔해진다)



////////////////////////////////////////////////////////
// immer와 mobx
//compose로 applymiddleware와 devtool을 연결하는 방법을 알아보자

//npm i redux-devtools-extension -D    으로 devtool을 설치하자

//store.js (리덕스 미들웨어 모임) 에서 설치한 npm을 불러오고
const { composeWithDevTools } = require('redux-devtools-extension');
//composeWithDevTools()로 기존의 applyMiddleware를 감싸준다
composeWithDevTools(
  applyMiddleware(
    firstMiddleware,
    thunkMiddleware,
  ),
);

//위의 코드에서 composeWithDevTools 는 아래의 긴 코드와 같은 동작을 한다 (자세한건 아래의 참조 코드에서 보자)
typeof window === 'object' &&
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  }) : compose;


////////////////////////////////////////////////////////////////////
//기존의 devtool compose는 아래와 같이 했다
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
);
const store = createStore(reducer, enhancer);


//그게 아래와 같이 쉽게 바뀌었다
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
////////////////////////////////////////////////////////////////////



