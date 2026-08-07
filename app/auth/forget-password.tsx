import React from "react";
import {View,StyleSheet,Text} from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";


export default function ForgotPasswordScreen(){

return(

<ScreenContainer>

<View style={styles.container}>


<AuthHeader

title="Reset"

highlight="Password"

subtitle="Enter your email and we will help you recover your account"

/>


<AuthInput

placeholder="Email address"

icon="mail-outline"

/>


<AuthButton

title="Send Reset Link"

onPress={()=>{}}

/>


<Text style={styles.back}>
Back to Login
</Text>


</View>

</ScreenContainer>

)

}


const styles=StyleSheet.create({

container:{
flex:1,
paddingTop:60
},

back:{
textAlign:"center",
marginTop:25,
color:"#FFC107",
fontWeight:"700"
}

});