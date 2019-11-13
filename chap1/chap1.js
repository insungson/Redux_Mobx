//1-1. 강좌 소개와 리덕스의 필요성
//Redux : 상태관리 도구 이다 (angular에서도 사용할 수 있는데 react랑 호환성이 좋다)

//(react는 자바스크립트 라이브러리이다 
//-> 이유는 react에서 상태관리, 라우팅등을 기본적으로 제공하지 않아서 프레임워크의 요건을 갖추지 못했기 때문이다)
//React의 생태계 자체는 프레임워크이다 실제로 리엑트를 사용할때 상태관리, 라우팅작업을 하기 때문이다

//여기서 상태관리를 Redux, Mobx 를 사용하기 때문이다

//Redux는 단방향 이다
//양뱡향은 인풋창  ----  데이터  (인풋창을 바꾸면 데이터가 자동으로 바뀌는 것이다)구조가 복잡하면 버그가 많이 발생한다
//페이스북이 이걸 해결하려 단방향 프로그래밍을 발전시켰고 Hooks가 생겼다(함수형 프로그래밍기반)

// 리덕스                   Component A
//Component A                 state
//Component B
//Component C                    Component B
//                                  state
//
//                                    Component C
//                                        state

//위에서 각각의 컴포넌트 state를 수정하는건 그냥 state를 변경하면된다.. 하지만 A,B,C가 부모-자식 관계일땐
//Context API를 사용하여 state를 변경하였다 (부모 메서드를 자식에서 사용,반대는 안됨..)
//Redux는 Context API에 몇개를 더 추가한 것이다
//(리덕스는 컴포넌트를 다 넣었기 때문에 개별컴포넌트가 없다면 각 컴포넌트에서 state가 필요없다)
//즉! 그냥 다른 컴포넌트와 상관없이 Component B 에서 state를 변경하고 싶으면 그냥 B state를 변경하면 되고, 
//다른 컴포넌트와의 관계가 있을땐 Redux를 사용하여 state를 변경하자 



/////////////////////////////////////////////
//1-2, action과 리덕스 장단점
//리덕스의 장점은 단방향이라는 점이다 
//store(데이터묶음)을 중심으로 단방향으로 유지된다
//리덕스 store는 객체이다 그리고 store안의 데이터를 state라고 부른다


//  Redux 단방향          
// state          ------->     action      --------->  dispatch
//{Comp A , 'a'}      ^     {type : a -> b}               |
//{Comp B , 12}       |                                   |
//{Comp C , null}     <------------------------------------  middleWare
//                                    Reducer(새로운 state를 만들어줌, 기존 state 대체 (불변성 조심))
// store
//(데이터 묶음)

//action은 state를 어떻게 바꿀지에 대한 행동을 적어 놓은 것이다
//dispatch는 action을 실행한다
//위의 화살표처럼 state를 바꾸려면 action을 통해 dispatch 를 실행시켜 Reducer를 통해
//새로운 state를 생성하여 기존의 state가 새로 생성된 state로 대체된다
//화살표 방향처럼 단방향으로 실행된다(반대로는 안된다)

//단방향의 장점! (에러해결이 쉽다)
//1. action에 대한 dispatch 실행이 기록이 되어 남는다 (누가 뭘 바꿨는지 기록이 남아 에러를 찾기 쉽다, 에러가 적다)
//2. 단방향으로 기록이 있기 때문에 뒤로 거슬러 올라갈 수 있다(타임머신기능)

//단점!
//1. action에 대해서 미리미리 만들어 둬야한다
//2. 타임머신 기능을 사용하기 위해선 불변성을 지켜야 하기 때문에 state객체를 매번 새로 만들어줘야 한다


/////////////////////////////////////////////////////////
//1-3 프로젝트 세팅과 공식문서
//https://redux.js.org/introduction/getting-started

//공식문서 읽는 법 (라이브러리, 프레임워크 공부는 이렇게 하자, 하다가 막히는 부분이 있으면 그때 강좌를 찾자)
//공식 문서는 다 읽어 보자 (이해가 가든 안가든)(굳이 API까지 읽을 필요는 없다)
//공식 문서를 보고 위의 도표를 스스로 그려보자 (흐름과 관계도가 어떻게 진행되는지 파악하는게 가장 중요하다)
//(에러시 대처방법, 관계및 흐름도를 파악하면 된다!)
//

//npm i redux    로  리덕스를 설치하자

//위의 그림을 이제 코드로 만들어보자

//index.js    파일을 만들고 여기에 코딩을 할 예정이다

const {createStore} = require('redux');

const reducer = () => {};
const initialState = {
  compA : 'a',
  compB : 12,
  compC : null,
};

const store = createStore(reducer,initialState);

console.log(store.getState());

// initialState.compA = 'b'; 
//이렇게 바꾸면 편하지만 리덕스에선 사용하면 안된다 대신! 추적이 가능하고 안정성이 생겼다

//위의 코드는 앞의 그림을 대충 나타낸 것이다


/////////////////////////////////////////////////////////
//1-4. action 생성기와 리듀서
//compA의 'a' -> 'b'   로 바꾸는 코드를 만들어보자

//action (**주의할점은 함수가 액션이 아니라 return 해주는 {}객체가 액션이다!!)
const ChangeComA = (data) => {
  return { //이부분이 액션이다
    type: 'CHAGE_COMP_A', //type, data 등은 다른 변수로 바꿀 수 있다
    data,
  };
};
ChangeComA(data:'b');
ChangeComA(data:'c');
//함수형으로 만들었기 때문에 액션들을 동적으로 만들어준다


//아래처럼 일일히 구체적으로 변수명을 적으며 action에 대한 data를 변경시키는것 보다 데이터를 넣어주면 바꿔주는 
//함수형을 사용하는게 좋다 
//(위의 함수형으로 만들면 동적으로 action객체를 만들어주기 때문에 아래와 같이 쓰지 않아도 된다)
const changeCompAtoB = {
  type:'CHANGE_COMP_A',
  data:'b',
};
const changeCompAtoC = {
  type:'CHANGE_COMP_A',
  data:'c',
};


const reducer = (prevState, action) => {
  switch(action.type){
    case 'CHANGE_COMP_A':
      return {
        compA:action.data,
        compB:12,
        compC:null,
      };
  }
};
//이렇게 reducer를 사용하는 이유는 과거의 기록을 따라 올라갈 수 있기 때문이다
//예를들어 자바스크립트에서 함수 사용없이 initialState.compA = 'b'; 로 데이터를 바꾸고,
//  initialState.compA = 'c';  로 데이터를 다시 바꿀때 a -> b -> c  로 바뀌는 동안 과거의 기록이 남지 않는다
//과거의 기록을 추적하려면 const nextState = {compA:'b'};    const nextState = {compA:'c'}; 
//이런식으로 계속 바꿔야 한다
//위의 작업처럼 reducer에서 매번 state객체를 매번 생성하여 과거의 기록을 쌓아가는 작업을 해준다(과거추적 가능)


///////////////////////////////////////////////
//1-5. 불변성과 subscribe

const initialState = {
  compA : 'a',
  compB : 12,
  compC : null,
};

//위의 것에서 compA를 'b' 로 바꿀때 compB,compC 의 값을 바꿀것이 아니기 때문에 중복이 발생된다
const nextState = {
  compA : 'b',
  compB : 12,
  compC : null,
};
//중복을 제거하는 가장 쉬운 방법은 얕은 복사를 하는 것이다 
//얕은 복사로 새로운 객체를 유지하고, 바꾸고 싶은 데이터만 바꾸는 것이다
const nextState = {
  ...initialState,
  compA:action.data,
};
//위와 같이 작업해주면 된다



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


// 1st { compA: 'a', compB: 12, compC: null }
// changed
// 2nd { compA: 'b', compB: 12, compC: null }

//객체 생성
//subscribe에서 바뀐것을 감지해서 changed가 찍힌 것이다
//새로운 객체가 생성되고 바꾸고 싶은 compA만 바뀌었다



////////////////////////////////////////////////////
//1-6. 현실적인 예제 보기

//index2.js 에서 좀더 현실적인 예제를 살펴보자 (로그인, 로그아웃)

//action은 기존의 state(initialState)를 어떻게 바꿀것인가? 만 생각하면 된다


//**아래의 단계로 배열부분의 state를 추가해준다
case 'ADD_POST':
    return {
      posts: [...prevState.posts, action.data], //이전 state객체 부분얕은 복사
    };

//**기존의 state가 배열형태에서는 아래의 과정으로 추가된다
//1. 초기 데이터
const initialState = {
  user: null, 
  posts: []
};
//2. 데이터추가 nextState 객체를 생성하고 데이터추가
const nextState = {
  ...initialState //초기 state 객체 복사 후 
  posts: [action.data], //데이터 추가
};
//3. 데이터추가 nextState 객체 생성후 기존 데이터 복사 후 데이터 추가
const nextState = {
  ...initialState
  posts: [...initialState.posts, action.data],  //배열에서도 기존의 배열은 ...initialState.posts 로 복사하고
};                                              //action.data로 추가할 데이터를 넣는다


/////////////////////////////////////////////////////////
//1-7 리덕스 Q&A

//redux store로 사용할 값과 하지 말아야 할 값의 구분은?
//-> 컴포넌트간에 글로벌하게 왔다갔다 하는건 redux state로
//-> 자신에게 사용하거나 부모-자식 같은 단순한 관계일때는 그냥 state로 사용한다
