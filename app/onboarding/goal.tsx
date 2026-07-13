import React, {useState} from "react";
import {View,StyleSheet} from "react-native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import SelectCard from "../../components/auth/SelectCard";
import {router} from "expo-router";


export default function GoalScreen(){

const [selected,setSelected]=useState("");


return(

<ScreenContainer>

<View style={styles.container}>

<Pressable onPress={() => router.back()} style={styles.backBtn}>
  <Ionicons name="arrow-back" size={20} color="#FFC107" />
</Pressable>

<StepIndicator current={3} total={6}/>


<AuthHeader

title="Choose"

highlight="Your Goal"

subtitle="What do you want to achieve?"

/>


<SelectCard

title="Lose Weight"

subtitle="Burn fat and become healthier"

icon="flame-outline"

selected={selected==="lose"}

onPress={()=>setSelected("lose")}

/>


<SelectCard

title="Maintain Weight"

subtitle="Keep your current body"

icon="fitness-outline"

selected={selected==="maintain"}

onPress={()=>setSelected("maintain")}

/>


<SelectCard

title="Gain Weight"

subtitle="Build muscle and increase weight"

icon="barbell-outline"

selected={selected==="gain"}

onPress={()=>setSelected("gain")}

/>



<AuthButton
title="Get Started"
onPress={()=>{
  router.push("/onboarding/activity");
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
}

});