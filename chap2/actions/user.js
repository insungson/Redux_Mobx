//객체는 action이고 함수들은 action creater이다
const logIn = (data) => { //비동기(async) action creator
  return (dispatch, getState) => { //비동기(async) action
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(logInSuccess({
          userId: 1,
          nickname: 'Son',
        }));
      },2000);
    } catch (error) {
      dispatch(logInFailure(error));
    }
  };
};

const logInRequest = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};
const logInSuccess = (data) => {
  return {
    type: 'LOG_IN_SUCCESS',
    data,
  };
};
const logInFailure = (error) => {
  return {
    type: 'LOG_IN_FAILURE',
    error,
  }
};

const logOut = () => {
  return {//action
    type: 'LOG_OUT',
  };
};

module.exports = {logIn,logOut};