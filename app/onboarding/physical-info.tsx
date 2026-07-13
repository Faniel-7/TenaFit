import React from "react";
import {View,StyleSheet} from "react-native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import{router} from "expo-router";


export default function PhysicalInfoScreen(){

return(

<ScreenContainer>

<View style={styles.container}>

<Pressable onPress={() => router.back()} style={styles.backBtn}>
  <Ionicons name="arrow-back" size={20} color="#FFC107" />
</Pressable>

<StepIndicator current={2} total={6}/>

<AuthHeader

title="Physical"

highlight="Details"

subtitle="Help us understand your body"

/>



<AuthInput
placeholder="Height (cm)"
icon="resize-outline"
/>


<AuthInput
placeholder="Weight (kg)"
icon="scale-outline"
/>


<AuthButton
title="Continue"
onPress={()=>{
  router.push("/onboarding/goal");
}}
/>


</View>

</ScreenContainer>

)

}


const styles=StyleSheet.create({

container:{
flex:1,
paddingTop:50
},

backBtn: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#17171E",
  borderWidth: 1,
  borderColor: "#2A2A2A",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 18,
},

});