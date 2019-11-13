const logIn = (data) => {
  return (dispatch, getState) => {
    dispatch(logInRequest(data));
    try {
      setTimeout(() => {
        dispatch(logInSuccess({
          userId: 1,
          nickname: 'Son',
        }));
      },2000);
      // axios.post().then().catch()으로 나중에 대체
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
  };
};

const logOut = () => {
  return {
    type: 'LOG_OUT',
  };
};

module.exports = {logIn, logOut};