import React, {useCallback} from 'react';
import {useObserver, useLocalStore} from 'mobx-react';

import useStore from './useStore';

const App = () => {
  const {userStore} = useStore();
  console.log(userStore);

  const state = useLocalStore(() => ({
    name: '',
    password: '',
    onChangeName(e){
      this.name = e.target.value;
    },
    onChangePassword(e){
      this.password = e.target.value;
    },
  }));

  const onClick = useCallback(() => {
    userStore.logIn({nickname:'Sonny',password:'비밀번호'});
  },[]);

  const onLogOut = useCallback(() => {
    userStore.logOut();
  },[]);

  return useObserver(() => (//hooks 에서는 데코레이터로 Observer를 사용할 수 없기 때문에 이렇게 사용함
    <div>
      {userStore.isLoggingIn
        ? <div>로그인 중</div>
        : userStore.data
          ? <div>{userStore.data.nickname}</div>
          : '로그인 해주세요'}
      {!userStore.data
        ? <button onClick={onClick}>로그인</button>
        : <button onClick={onLogOut}>로그아웃</button>}
        <input value={state.name} onChange={state.onChangeName}/>
        <input value={state.password} type='password' onChange={state.onChangePassword}/>
    </div>
  ));
};

export default App;