import React from "react";
import { View, StyleSheet } from "react-native";


type Props={
 current:number;
 total:number;
};


export default function StepIndicator({
 current,
 total
}:Props){

return(

<View style={styles.container}>

{
Array.from({length:total}).map((_,index)=>(

<View
key={index}
style={[
styles.dot,
{
backgroundColor:
index < current
? "#FFC107"
: "#333"
}
]}
/>

))
}

</View>

)

}


const styles=StyleSheet.create({

container:{
flexDirection:"row",
justifyContent:"center",
gap:8,
marginBottom:30
},

dot:{
width:30,
height:5,
borderRadius:5
}

});