import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AuthDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />

      <Text style={styles.text}>
        or continue with
      </Text>

      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    alignItems:"center",
    marginVertical:25
  },

  line:{
    flex:1,
    height:1,
    backgroundColor:"#333"
  },

  text:{
    color:"#8A8A8A",
    marginHorizontal:12,
    fontSize:13
  }
});