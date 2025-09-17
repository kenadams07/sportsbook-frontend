// I can't directly edit your frontend file since I don't have the exact path
// But here's the improved version of your saga function with better error handling:

function* getUserDataRequest(action) {
  try {
    console.log("getUserDataRequest called with action:", action);
    
    // Check if token exists before making the request
    const token = getLocalStorageItem("token");
    console.log("Token from localStorage:", token);
    
    if (!token) {
      console.error("No token found in localStorage");
      yield put(getUserDataFailure());
      return;
    }

    const response = yield call(API.get, "/users/profile");
    const data = response.data;
    console.log("data getuserdata", data);
    console.log("Full response:", response);

    // Handle the response structure with success field
    if (data?.success === true) {
      console.log("getUserData success with data:", data?.data);
      yield put(getUserDataSuccess(data?.data));
      
      // Update localStorage with the new user data
      console.log("Updating localStorage with user data:", data?.data);
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        console.log("Executing callback function");
        yield call(action.callback, data);
      }
    } 
    // Handle the previous response structure with code field
    else if (data?.meta?.code === 200 || data?.code === 200) {
      console.log("getUserData success with legacy data structure:", data?.data);
      yield put(getUserDataSuccess(data?.data));
      
      // Update localStorage with the new user data
      console.log("Updating localStorage with user data:", data?.data);
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        console.log("Executing callback function");
        yield call(action.callback, data);
      }
    } else {
      console.log("getUserData failed with data:", data);
      yield put(getUserDataFailure());
    }
  } catch (error) {
    console.error("Error in getUserDataRequest:", error);
    console.error("Error response:", error.response);
    yield put(getUserDataFailure());
  }
}