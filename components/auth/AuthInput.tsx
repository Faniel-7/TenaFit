import React from "react";
import {
View,
TextInput,
StyleSheet
} from "react-native";

import {Ionicons} from "@expo/vector-icons";
import {useTheme} from "../../context/ThemeContext";


type Props={
placeholder:string;
icon:any;
secureTextEntry?:boolean;
};


export default function AuthInput({
placeholder,
icon,
secureTextEntry
}:Props){

const {colors}=useTheme();


return(

<View style={[
styles.container,
{
backgroundColor:"#17171E",
borderColor:colors.border
}
]}>

<Ionicons
name={icon}
size={22}
color="#9CA3AF"
/>


<TextInput

placeholder={placeholder}

placeholderTextColor="#777"

secureTextEntry={secureTextEntry}

style={[
styles.input,
{color:colors.text}
]}

/>

</View>

)

}


const styles=StyleSheet.create({

container:{
height:62,
borderRadius:18,
borderWidth:1,
flexDirection:"row",
alignItems:"center",
paddingHorizontal:18,
marginBottom:15
},


input:{
flex:1,
marginLeft:12,
fontSize:16
}

});