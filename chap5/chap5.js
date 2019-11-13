//mobx를 hooks컴포넌트, class컴포넌트 에서 어떻게 다르게 사용하는가?

//리덕스에선 안되지만 mobx에서는 되는 action

//mobex-react 7 참조
//package.json에서 decorator와 mobx-react(mobex와 리엑트연결)을 추가로 설치한다


//mobx에서는 리엑트의 state를 아예 없앨 수 있다(observable을 써서)
//

//mobx 에서 provider태그로 감싸는 경우

//데코레이터를 사용하기 위해선 웹팩에 아래와 같이 데코레이터 설정을 해줘야 작동된다
//webpack.js 의 plugin에서 decorators는 legacy 옵션, class-properties는 loose 옵션 을 설정해야 에러가 안난다

//**observer는 데코레이터로 class component 위에 쓴다 
//(메서드에 사용해도 되는데 공식문서에서 정해준 위치만 사용하자 - 에러가 발생할수있다)
import { observer } from 'mobx-react';
import { observable } from 'mobx';
//데코레이터를 없애면 observer(App) 처럼 사용해야 한다  만약 클래스에 적용시키려면 observer(class App extends {});
//위와 같이 클래스 전체를 감싸줘야 하는데 너무 지저분해지므로 데코레이터를 써서 감싸줄 수 있다(코드가 깔끔해진다)
//** 데코레이터는 클래스에선 사용할 수 있지만... Hooks 같은 일반 함수에서는 사용할 수 없다 
//   그래서 observer()로 감싸는것이다
@observer  
class App extends Component {
  state = observable({
    name: '',
    password: '',
  });
}
//**observer 는 감싸고 있는 리엑트 클래스 컴포넌트안의 연관된 observables 가 변할때마다 자동으로 알려주고, 
//컴포넌트가 자동으로 리랜더링 된다. 물론 관련된 변경이 없을땐 컴포넌트들이 리랜더링 되지 않는다


//mobx는 state 를 observavble로 만들수 있다 (아래의 예시는 input태그에서 state를 적용시켰다)
<input value={this.state.name} onChange={(e) => {
  this.state.name = e.target.value;
}} />
<input value={this.state.password} type="password" onChange={(e) => {
  this.state.password = e.target.value;
}}  />
//클레스의 프로퍼티로 onchangeName 를 뺄수 있다(이렇게 하면 local observable을 만든것이다)
const onChangeName = (e) => {
  this.state.name = e.target.value;
} 
//그리고 기존의 input 태그를 아래처럼 바꾼다
<input value={this.state.name} onChange={this.onChangeName} />
//마찬가지로 password 도 적용시키자
const onChangePassword = (e) => {
  this.state.password = e.target.value;
}
//그리고 기존의 input 태그를 아래처럼 바꾼다
<input value={this.state.password} type="password" onChange={this.onChangePassword}  />



//mobx에선 store를 굳이 1개로 묶을 필요가 없다 
//store.js를 보자
const { observable } = require('mobx'); //mobx에서 observable을 가져와서 
const userStore = observable({ //여기처럼 따로 감싸주었다
  isLoggingIn: false,
  data: null,
  logIn(data) {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.data = data;
      this.isLoggingIn = false;
      postStore.data.push(1); //userStore 부분에서 postStore의 데이터도 바꿀 수 있다
    }, 2000);                 //이부분처럼 리덕스에서 구현하려면 액션을 따로 호출해야한다
  },                          //userStore의 액션에서 postStore 데이터도 바꿀수 있다는걸 보여주는 예제
  logOut() {                  //(로그인하면서 게시글 1올려주기) (로긴할때마다 1씩 추가됨)
    this.data = null;
  },
});
const postStore = observable({ //여기도 마찬가지로 감싸주었다  store를 2개로 나눈 것이다
  data: [],
  addPost(data) {
    this.data.push(data);
  },
});
export { userStore, postStore };
//위의 코드를 보면 mobx의 장점이 나타난다 
//store를 2개로 나눠서 각각 데이터를 추가할 수 있다 
//userStore에서는 비동기식을 바로 사용하고 this.isLoggingIn = true; 처럼 바로 데이터를 추가하고,
//postStore에서는 data: [], this.data.push(data); 배열형식의 데이터를 바로 추가했다
//원래 리덕스의 액션에서는 user에 딸린 action은 user쪽 store만 바꿀 수 있는데,
//mobx에서는 user store에 딸린 action도 post store쪽 action도 동시에 바꿀 수 있다
//**리덕스에서는 thunk를 사용하여 함수형을 만들고 비동기처리를 하는데(리덕스는 action들이 전부 동기여야 하기 때문이다)
//  mobx에서는 그냥 비동기처리를 하면된다 (위에선 setTimeout()을 사용했지만 axios()를 바로 써도 된다)

//App.jsx에서 store.js를 가져와서 userStore.logIn({데이터}), userStore.logOut() 처럼 바로 사용하면 된다

//리액트 VS mobx 에서 state 바꿀때 코드
//mobx는 observable을 사용하기 때문에 직관적으로 데이터를 바꿀 수 있다 아래의 예를 보자
//리액트
onChangeName = (e) => {
  this.setState({
    name: e.target.value,
  })
}
//mobx
onChangeName = (e) => {
  this.state.name = e.target.value;
}

//mobx도 devtool이 있다  크롬웹스토어에서 설치하고 이툴을 쓰면 동작들을 확인할 수 있다
//(mobx-state-tree 를 사용하면 좀 더 체계적으로 mobx를 관리할 수 있다)



//mobx에서 inject(), provider를 사용하지 않을 것을 추천하고 있다
//  mobx에서 inject('userStore(예시)')는  this.props.userStore; 처럼 this.props안에서 
//  userStore를 사용할 수 있다
//  mobx에서 provider는 
//  <Consumer> 로 감싸져 있는것은 context API를 사용한 것으로 대충 아래와 같이 사용한다
<Consumer>
  ({userStore, postStore}) => ()
</Consumer>
//this.props와 마찬가지로 context API를 통해서 컴포넌트와 스토어들(userStore, postStore)을 묶어준 것이다


//코드의 취향차이!
//1) 클래스 컴포넌트와 스토어가 묶여있는 코드가 좋다면 inject()를 사용하여 this.props에서 store들을 넣던지 
//2) 아님 context API를 사용해서 Consumer를 사용해서 store를 받던지 
//3) 아님 제로초 예제처럼 import 해서 그대로 써도 된다

