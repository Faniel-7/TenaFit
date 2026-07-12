import React from "react";
import {View,StyleSheet} from "react-native";


import ScreenContainer from "../../components/common/ScreenContainer";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import{router} from "expo-router";


export default function SignupScreen(){

return(

<ScreenContainer>

<View style={styles.container}>


<AuthHeader

title="Create"

highlight="Account"

subtitle="Start your personalized fitness journey"

/>


<AuthInput

icon="person-outline"

placeholder="Full Name"

/>


<AuthInput

icon="at-outline"

placeholder="Username"

/>


<AuthInput

icon="mail-outline"

placeholder="Email"

/>


<AuthInput

icon="lock-closed-outline"

placeholder="Password"

secureTextEntry

/>



<AuthButton
title="Get Started"
onPress={()=>{
  router.push("/onboarding/personal-info");
}}
/>



</View>


</ScreenContainer>

)

}


const styles=StyleSheet.create({

container:{
flex:1,
paddingTop:60
}

});