//////////////////////////////////////
//이제 hooks 컴포넌트를 알아보자 (chap8부분)

//5의 코드를 class -> hooks로 바꿔보자

//클래스에선 클래스 안에 매서드 프로퍼티를 사용
//훅스에선 함수형으로 사용

//훅스에서 localState를 만들때 아래와 같이 만들어도 되지만
const state = observable({스테이트정의});
//mobx에서는 useLocalStore를 제공한다
//컴포넌트 1개 안에서만 동작하는것이 useLocalStore이다(mobx는 자유롭기 떄문에 다른 컴포넌트에서도 사용은 가능하다)
const state = useLocalStore({스테이트정의});


//App.jsx 에서 아래 부분은 글로벌 스토어
import { useObserver, useLocalStore } from 'mobx-react';
//아래 부분은 로컬 스토어 라고 생각하면 된다
const state = useLocalStore(() => ({
  name: '',
  password: '',   //스테이트
  onChangeName(e) { //스테이트를 바꾸는 액션
    this.name = e.target.value;
  },
  onChangePassword(e) {
    this.password = e.target.value;
  }
}));

//로컬 스토어, 글로벌 스토어 모두 구성은 같다 (스테이트, 스테이트를 바꾸는 액션이 들어있다)
//로컬스토어는 App컴포넌트 안에서만 쓰이는것으로 생각하면 된다


//mobx 공식 문서에서 contextAPI로 글로벌 스토어를 관리하는 방법이 나온다
//(그냥 아래처럼 편하게 사용해도 된다)
//방법1)
  import { userStore, postStore } from './store';
  //(클래스 컴포넌트에선 provider inject(), provider consumer를 사용했다)
  //App.jsx 에서 userStore, postStore를 묶어서 App 함수에서 사용했다

//방법2)
  //context.jsx 에서  아래처럼 React.createContext() 로 Store들을 묶어준다
  export const storeContext = React.createContext({
    userStore,
    postStore,
  });
  //그 아래에 Provider를 만든다 (context를 제공하는게 provider이다)
  //아래처럼 provider를 context에서 꺼내와서 만들어주고 provider는 client.jsx에서 ReactDOM으로 랜더링할때
  //넣어준다
  export const StoreProvider = ({ children }) => {
    return (
      <storeContext.Provider>
        {children}
      </storeContext.Provider>
    );
  };
  //위처럼 provider로 감싸진 것들은 context라고 보면 된다

  //client.jsx  의 Hot과 App부분에서 context.jsx 에서 React.createContext() 로 묶어준 userStore,postStore
  //를 사용할 수 있게 context가 짜인다(react contextAPI 부분을 보자) userStore,postStore가 
  //Hot컴포넌트 App컴포넌트와 context 관계가 된다
  ReactDOM.render(
    <Hot />,
    document.querySelector('#root'),
  ); 

  //useStore.js  를 만들고 context API로 묶어주기 위해 function useStore(){} 를 만들자
  //(사용안해도 되지만 App컴포넌트와 묶어주기 위해서 만든다)
  //useStore()  는 커스텀 훅으로 context.jsx  에서 만든 context를 사용해서 아래와 같이 만든다
  function useStore() {
    const { userStore, postStore } = React.useContext(storeContext);

    return { userStore, postStore };
  }

  //App.jsx 에서 App함수안에서 userStore.js에서 불러온 함수인 useStore로 묶어진 store를 사용하면 된다
  import useStore from './useStore';
  const App = () => {
    const { userStore, postStore } = useStore(); //contextAPI를 이용해서 store를 묶어준 것이다

//contextAPI를 통해 store를 묶어주려면 
//1) context를 만들고, provider를 만들고(context.jsx에서 만듬)
//2) useStore 라는 미들웨어를 하나 더 만들어서(useStore.js 에서 만듬) (커스텀훅스)
//3) App 함수랑 묶어주면 된다(App.jsx에서 처리)
//4) provider로 클라이언트를 감싼다 (client.jsx에서 처리)


//참고로 useStore.js 에서 커스텀 훅을 만들었는데 아래와 같이 마음대로 만들 수 있다
function useUserStore() {
  const { userStore } = React.useContext(storeContext);

  return userStore;
}
function usePostStore() {
  const { postStore } = React.useContext(storeContext);

  return postStore;
}
//이렇게 하면 컴포넌트랑 묶여서 하나처럼 인식이 될 수 있다




//mobx에서는 PostStore의 데이터와 UserStore의 데이터를 동기적으로 바꿀수 있다
//redux에서는 thunk의 비동기적 action creator로 userStore에서 PostStore부분을 가지고 올 수 있다
//하지만 비동기적 방식이다
const logIn = (data) => { // async action creator
  return (dispatch, getState) => { // async action
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        //userStore부분
        dispatch(logInSuccess({
          userId: 1,
          nickname: 'zerocho'
        }));
        //postStore부분
        dispatch(addPost()); // PostStore부분을 가지고 올 수 있다
      }, 2000);
      // axios.post().then().catch()으로 나중에 대체
    } catch (e) {
      dispatch(logInFailure(e));
    }
  };
};
//동기적으로 바꾸려면 역시 비동기적 action을 만들어서 동기적으로 처리해야한다
const changeBoth = () => {
  return (dispatch, getState) => { //여까진 비동기적 액션처리
    //이안에서 동기적으로 처리하면 된다
    dispatch(changeUserStore());
    dispatch(changePostStore());
  }
};
//이렇게 하는건 하나의 액션에서 두가지 store의 데이터를 바꾸는게 아니라 내부적으로 액션이 2개인것다
//리덕스에선 1개의 액션이 1개의 store 밖에 못바꾼다

//반면! mobx에선 1개의 액션으로 2개의 store를 바꾸는것이 가능하다
const userStore = observable({
  isLoggingIn: false,
  data: null,
  logIn(data) {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.data = data;
      this.isLoggingIn = false; //userStore 데이터 바꾸고
      postStore.data.push(1);   //postStore 데이터를 바꿀수 있다
    }, 2000);
  },
  logOut() {
    this.data = null;
  },
});


//setState와 useLocalStore() 의 차이
//setState (React 처럼 불변성을 사용해서 데이터를 바꿔야하고)
const [name, setName] = setState('초기값');
setName((prevState) => {
  ...prevState, //불변성 유지를 위한 얕은 복사
  name: 바꿀값,
});
//useLocalStore (mobx처럼 불변성을 안지키고 state객체에 직접 접근해서 데이터를 바꿀 수 있다)
const state = useLocalStore(() => {
  name: '',
  onChangeName: action((e) => {
    state.name = e.target.value;
  }),
});
//state 대신 this를 사용하고 싶다면 action에서  => 가 아닌 function을 사용해야한다
const state = useLocalStore(function(){
  return {
    name: '',
    onChangeName: action(function(e){
      this.name = e.target.value;
    }),
  };
});



//https://mobx-react.js.org/state-outsourcing   참고
//mobx-react에서 useAsObservableSource 가 있는데 이건 props같이 observable이 아닌것들을 observable하게 만들어준다
import {useAsObservableSource} from 'mobx-react'
const PersonSource = ({name,age}) => { //name,age를 props로 부모에게 받은것이다(observable처리가 안된것일수도있다)
  const person = useAsObservableSource({name,age}); //useAsObservableSource를 사용해서 observable하게 만든다
  return <PersonBanner person={person} /> //이제 name,age가 바뀌면 리랜더링 된다
}


//** 디스트럭터링 처리할때 알아야할 점
//** Observable은 디스트럭터링 하면 Observable이 깨져버린다
//** Observable은 객체까지는 유지가 되지만 숫자,문자,boolean 같은 원시값은 깨져버린다
const App = () => {
  const { userStore } = useStore();
  console.log(userStore);
//아래와 같이 코드를 깔끔하게 쓰려고 디스터럭터링 하면 리랜더링이 안된다
  const {isLoggingIn} = userStore;//
  isLoggingIn = false; //디스트럭터링 해서 코드는 깔끔해지지만 Observable이 깨져 랜더링이 안된다
//아래처럼 객체단위로 사용해야 리랜더링이 된다!
  userStore.isLoggingIn = false;