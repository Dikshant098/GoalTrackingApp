import { Image, StyleSheet, View } from "react-native";
import { Colors } from "../constants/styles";

const Loader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image source={require("../assets/loader/loader-double-ring.gif")} style={styles.loaderImg} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.7)',
        justifyContent:'center',
        alignItems:'center',
    },
    imgContainer:{
        justifyContent:'center',
        alignItems:'center',
        height: 200,
        width:'90%',
        backgroundColor:Colors.whiteColor,
        borderRadius:20,
    },
    loaderImg: {
        height: 150,
        width: 150,
        resizeMode:'cover',
    }
});

export default Loader;