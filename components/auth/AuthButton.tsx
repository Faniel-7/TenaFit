import React from "react";
import {
TouchableOpacity,
Text,
StyleSheet
} from "react-native";


type Props={
title:string;
onPress:()=>void;
};


export default function AuthButton({
title,
onPress
}:Props){

return(

<TouchableOpacity
onPress={onPress}
style={styles.button}
>

<Text style={styles.text}>
{title}
</Text>

</TouchableOpacity>

)

}


const styles=StyleSheet.create({

button:{
height:60,
borderRadius:18,
backgroundColor:"#FFC107",
justifyContent:"center",
alignItems:"center",
marginTop:15
},

text:{
fontSize:17,
fontWeight:"800",
color:"#000"
}

});