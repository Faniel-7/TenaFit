import React from "react";
import {View,StyleSheet,Text} from "react-native";


import ScreenContainer from "../../components/common/ScreenContainer";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthDivider from "../../components/auth/AuthDivider";
import SocialButtons from "../../components/auth/SocialButtons";
import {router} from "expo-router";


export default function LoginScreen(){
    


return(

<ScreenContainer>

<View style={styles.container}>


<AuthHeader

title="Welcome"

highlight="Back"

subtitle="Continue your fitness journey"

/>


<AuthInput

icon="person-outline"

placeholder="Username or Email"

/>


<AuthInput

icon="lock-closed-outline"

placeholder="Password"

secureTextEntry

/>



<AuthButton

title="Login"

onPress={() =>
router.push("/home")
}

/>


<AuthDivider/>


<SocialButtons/>


<Text style={styles.forgot}>
Forgot password?
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

forgot:{
textAlign:"center",
marginTop:30,
color:"#FFC107"
}

});