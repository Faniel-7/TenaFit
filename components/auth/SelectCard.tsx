import React from "react";
import {
Pressable,
Text,
StyleSheet
} from "react-native";

import {Ionicons} from "@expo/vector-icons";


type Props={
title:string;
subtitle?:string;
icon:any;
selected?:boolean;
onPress:()=>void;
};


export default function SelectCard({
title,
subtitle,
icon,
selected,
onPress
}:Props){


return(

<Pressable

onPress={onPress}

style={[
styles.card,
{
borderColor:selected
?"#FFC107"
:"#2A2A2A",

backgroundColor:selected
?"#211B05"
:"#17171E"

}
]}

>


<Ionicons
name={icon}
size={28}
color={
selected
?"#FFC107"
:"#fff"
}
/>


<Text style={styles.title}>
{title}
</Text>


{
subtitle &&
<Text style={styles.subtitle}>
{subtitle}
</Text>
}


</Pressable>

)

}


const styles=StyleSheet.create({

card:{
height:90,
borderRadius:20,
borderWidth:1.5,
paddingHorizontal:20,
justifyContent:"center",
marginBottom:15
},

title:{
color:"#fff",
fontSize:18,
fontWeight:"800",
marginLeft:45,
marginTop:-30
},

subtitle:{
color:"#999",
fontSize:13,
marginLeft:45,
marginTop:5
}

});