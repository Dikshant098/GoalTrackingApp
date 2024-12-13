import { NavigationContainer } from "@react-navigation/native";
import {useSelector } from "react-redux";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

// const NavigationStack = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getUser());
//   }, [dispatch]);

//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const { user } = useSelector((state) => state.user);
// //   console.log("User Detail----> ", user?.data?.user_detail);

//   // Determine which navigator to show based on the user's details
//   let showNavigator;
//   if (isLoggedIn) {
//     if (user?.data?.user_detail !== null) {
//       console.log("User ----> ", user?.data?.user_detail);
//       showNavigator = <AppNavigator initialRouteName="BottomTabBar" />;
//     } else if (user?.data?.user_detail === null){
//       console.log("User Detail ----> ", user?.data?.user_detail);
//       showNavigator = <UserDetailNavigator />;
//     }
//   } else {
//     showNavigator = <AuthNavigator />;
//   }
//   return <NavigationContainer>{showNavigator}</NavigationContainer>;
// };

const NavigationStack = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
      <NavigationContainer>
          {isLoggedIn ? <AppNavigator/> : <AuthNavigator />}
      </NavigationContainer>
  );
}

export default NavigationStack;
