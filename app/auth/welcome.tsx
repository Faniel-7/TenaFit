import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthButton from "../../components/auth/AuthButton";
import { useTheme } from "../../context/ThemeContext";



export default function WelcomeScreen(){

const {colors}=useTheme();


return(

<ScreenContainer>

<View style={styles.container}>


<View style={styles.logoCircle}>
<Text style={styles.logoText}>
TF
</Text>
</View>


<Text style={[styles.title,{color:colors.text}]}>
Welcome to{" "}
<Text style={{color:"#FFC107"}}>
TenaFit
</Text>
</Text>


<Text style={[styles.subtitle,{color:colors.subtext}]}>
Your AI powered nutrition and fitness
companion.
</Text>



<AuthButton
title="Get Started"
onPress={()=>{
  router.push("/auth/signup");
}}
/>

<Pressable onPress={() => router.push("/auth/login")}>
  <Text style={{ color: "#FFC107", fontWeight: "700", marginTop: 24, fontSize: 16, textAlign: "center" }}>
    Already have an account? Login
  </Text>
</Pressable>



</View>

</ScreenContainer>

)

}



const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
paddingHorizontal:20,
alignItems:"center"
},


logoCircle:{
width:150,
height:150,
borderRadius:75,
backgroundColor:"#FFC107",
justifyContent:"center",
alignItems:"center",
marginBottom:40
},


logoText:{
fontSize:55,
fontWeight:"900",
color:"#000"
},


title:{
fontSize:38,
fontWeight:"900",
textAlign:"center"
},


subtitle:{
fontSize:16,
textAlign:"center",
marginTop:15,
marginBottom:45,
lineHeight:24
},


loginText:{
marginTop:25,
color:"#999",
fontSize:15
}

});