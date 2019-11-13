import React, {Component} from 'react';
import {connect} from 'react-redux';
const {logIn, logOut} = require('./actions/user');

class App extends Component {
  onClick = () => {
    this.props.dispatchLogIn({
      id:'Sonny', 
      password:'비밀번호',
    });
  };

  onLogout = () => {
    this.props.dispatchLogOut();
  };

  render() {
    const {user} = this.props;
    console.log('확인!!',user.data);
    return (
      <div>
        {user.isLoggingIn
          ? <div>로그인 중</div>
          : user.data
            ? <div>{user.data.nickname}</div>
            : '로그인 해주세요'}
        {!user.data 
          ? <button onClick={this.onClick}>로그인</button>
          : <button onClick={this.onLogout}>로그아웃</button>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLogIn: (data) => dispatch(logIn(data)), //데이터는 store에서 가져오더라도 위에서 실행에 대한 
  dispatchLogOut: () => dispatch(logOut()),       //action메서드는 따로 구분해서 실행시킨다
}); //store.js에서 보면 알겠지만 store에는 state와 reducer를 저장한다. thunk는 비동기 실행을 위해 사용

export default connect(mapStateToProps, mapDispatchToProps)(App); //여기서 store와 App을 연결함