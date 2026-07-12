import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  title:string;
  highlight?:string;
  subtitle:string;
};

export default function AuthHeader({
  title,
  highlight,
  subtitle
}:Props){

const {colors}=useTheme();

return(
<View style={styles.container}>

<Text style={[styles.title,{color:colors.text}]}>

{title}

{highlight && (
<Text style={{color:"#FFC107"}}>
{" "}{highlight}
</Text>
)}

</Text>


<Text style={[styles.subtitle,{color:colors.subtext}]}>
{subtitle}
</Text>


</View>
)

}


const styles=StyleSheet.create({

container:{
marginBottom:35
},

title:{
fontSize:34,
fontWeight:"900",
letterSpacing:-1
},

subtitle:{
fontSize:16,
marginTop:10,
fontWeight:"500"
}

});