import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux'; 
//useDispatch redux-thunk 유저를 위한 dispatch접근
//useSelector Hooks 에서 redux store state 접근가능
const {logIn, logOut} = require('./actions/user');

const App = () => {
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts); 
  //reducers/index에서 combineReducers()에서 프로퍼티가 posts 이고 store에서 이부분을 store에 저장하기 
  //때문에 이렇게 접근
  //(기본적으로 store.js에서 저장된 값은 client.jsx에서 provider로 묶인 value가 store인 태그안에 있으므로
  //state로 받아서 접근하는게 가능하다)
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(logIn({
      id: 'Sonny',
      password: '비밀번호',
    }));
  },[]);

  const onLogOut = useCallback(() => {
    dispatch(logOut());
  },[]);

  return (
    <div>
      {user.isLoggingIn
        ? <div>로그인중</div>
        : user.data
          ? <div>{user.data.nickname}</div>
          : '로그인해주세요'}
      {!user.data
        ? <button onClick={onClick}>로그인</button>
        : <button onClick={onLogOut}>로그아웃</button>}
    </div>
  );
};

export default App;