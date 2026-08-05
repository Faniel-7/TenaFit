import React,{useState} from "react";
import {View,StyleSheet} from "react-native";

import ScreenContainer from "../../components/common/ScreenContainer";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthButton from "../../components/auth/AuthButton";
import StepIndicator from "../../components/auth/StepIndicator";
import SelectCard from "../../components/auth/SelectCard";
import{router} from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";



export default function ActivityScreen(){

const [selected,setSelected]=useState("");


return(

<ScreenContainer>

<View style={styles.container}>

<Pressable onPress={() => router.back()} style={styles.backBtn}>
  <Ionicons name="arrow-back" size={20} color="#FFC107" />
</Pressable>


<StepIndicator current={4} total={6}/>


<AuthHeader

title="Activity"

highlight="Level"

subtitle="How active are you?"

/>



<SelectCard

title="No Exercise"

subtitle="Little or no physical activity"

icon="bed-outline"

selected={selected==="none"}

onPress={()=>setSelected("none")}

/>



<SelectCard

title="Light Exercise"

subtitle="Walking, stretching, skipping"

icon="walk-outline"

selected={selected==="light"}

onPress={()=>setSelected("light")}

/>



<SelectCard

title="Hard Exercise"

subtitle="Gym and intense workouts"

icon="barbell-outline"

selected={selected==="hard"}

onPress={()=>setSelected("hard")}

/>



<AuthButton

title="Continue"

onPress={() =>
router.push("/onboarding/commitment")
}

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