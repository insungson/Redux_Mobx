/////////////////////////////////////////////
//Mobx
//새로운 폴더를 만들고
//npm i mobx     로 mobx를 설치해 주자

//mobx는 immer가 기본적으로 적용되어 있다

//react-redux는 store.subscribe 를 내장하고 있고,
//react-mobx는 observer 를 내장하고 있다

//observable        ------->  observer(store.subscribe 와 비슷하다)
//|--------------
//|  state       |      ------>      action 
//|{name:'zero', |                   함수, 객체
//|age:26,       |       <------     ex) state.name = 'nero' 
//|married:false}|                        
//|---------------

//위와 같이 state가 있고 state를 observable 객체로 감싸준다 
//그리고 state를 action에서 바꿀때마다 Observable이 Observer들에게 바뀐점에 대해 말해준다

//autorun() : observable의 state가 바뀔때 마다 콜백함수가 실행한다
//reaction() : 첫번쨰인자 함수 내부에 return 하는 state값이 바뀔때 실행한다

//state 를 observable로 감싸고, 
const state = observable({
  compA: 'a',
  compB: 12,
  compC: null,
});
autorun(() => {
  console.log('changed');
});
//아래와 같이 state에 접근해서 state를 바꾸면 된다
state.compA = 'c';
state.compA = 'c';
state.compA = 'c';
//이렇게 3번 실행하면 콘솔에 changed가 1번 찍힌다 
//mobx가 기본적으로 위와 같이 코드를 붙여도 1번 실행되기 때문이다


//그래서 여기서 runInAction()으로 action을 구분할 수 있다
//예를 들면 아래와 같이 runInAction()을 2번 실행하면 autorun()에서 2번 콜백함수가 실행되기 때문에 콘솔이 2번찍힌다
const state = observable({
  compA: 'a',
  compB: 12,
  compC: null,
});
autorun(() => {         //state가 바뀔때 마다 실행된다
  console.log('changed', state.compA);
});
reaction(() => {
  return state.compB; //state.compB;가 바뀔때만 실행된다 첫번째 runInAction에서 state.compB가 변경되므로 
}, () => {            //1회 실행된다
  console.log('reaction', state.compB);
});
runInAction(() => { //이걸 안씌워도 작동은 한다 (다만 action을 구분하고 싶다면 횟수를 여러번 쓰면된다)
  state.compA = 'c';
  state.compB = 25;
  state.compC = 'c';
});
runInAction(() => {
  state.compC = 'd';
});
//아래와 action()을 변수에 넣으면 원할때마다 action을 실행할 수 있다(바로 만들어서 실행한게 runInAction()이다)
const change = action(() => {
  state.compA = 'c';
  state.compB = 25;
  state.compC = 'c';
});
change();
change(); 


//mobx 도 state를 나눌 수 있다
//redux는 state를 하나로 묶어야 한다(그 안에서 나눌수는 있어도)
//mobx에서는 아래와 같이 observable()로 묶는다면 state를 나눌수 있다
const userState = observable({
  isLoggingIn: true,
  data: null,
});
const postState = observable([]);
//redux에서는 아래와 같이 state를 initialState객체 하나로 묶어야 한다
const initialState = {
  user: {
    isLoggingIn: false,
    data: null,
  },
  posts: [],
};


//재밌는건 mobx는 아래와 같이 하나의 action안에서 한번에 여러 동작을 할 수 있다
runInAction(() => {
  postState.push({ id: 1, content: '안녕하세요.' });  //게시글을 바꾸면서
  userState.data = {       //유저의 정보를 바꾼다
    id: 1,
    nickname: 'zerocho',
  };
});
//redux에서는 (예제에서) postReducer, userReducer를 나눴기 때문에 
// 사용자에 대한 데이터는 userReducer에 들어가고, 게시글에 대한 데이터는 postReducer에 들어가야하기 때문에
// 하나의 action으로 userData, postData둘다 바꾸고 싶지만 action은 어딘가에 속해야 한다
// 즉! userReducer가 있고 그 안에 action들이 있는것이다 (action에 userReducer가 있지 않다!)
//(redux에서 위의 mobx 예시처럼 2개의 action을 동시에 실행하려면 action을 2개 만들어서 동시에 실행하는 방법밖에 없다)

//redux의 단점은
//1. 데이터를 묶어줘야 하는 reducer 단위로 쪼개서 initialState{} 객체 하나로 묶어줘야 하고
//2. reducer 사이를 넘나들며 데이터를 바꾸기 힘들다

//반면 mobx는 그런 제약 없이 바꾸는게 가능하다

//redux는 불변성을 지키면서 데이터를 바꾸고, (불변성을 유지하면 타임머신 기능이 되고, 모든 변경 히스토리 추적이 된다)
//mobx는 불변성을 안지키면서 데이터를 바꾼다


//여담으로 mobx에서 class를 안쓰는이유(제로초생각)
//웹 사이트에서 회원가입, 로그인을 하면 회원이 1명 생기고 1명만 로그인하지 여러명이 로그인하지는 않는다
//class의 특징은 new로 여러 객체인스턴스를 사용한다
//어차피 한번만 사용할 거면 자바스크립트의 싱글턴 방식을 사용하는게 더 편하다
//http://woowabros.github.io/experience/2019/01/02/kimcj-react-mobx.html
//(위의 링크에서 보면 mobx는 class로 객체인스턴스를 만들기 때문에 스프링 프레임워크와 유사한 면이 있다고한다)

//자바스크립트에서 class를 사용하는 이유는 new로 객체 인스턴스를 찍어내려고 사용하는것이다
class userStore = {
  state = observable({
    name: 'zerocho',
    age: 26, 
  });
  @action
  changeName(value){
    this.state.name = value;
  }
}
const userState = new userStore();
const userState = new userStore();
const userState = new userStore();

//싱글턴 방식
const userState = observable({
  name: 'zerocho',
  age: 26,
  changeName(value){
    this.name = value;
  }
});
userState();