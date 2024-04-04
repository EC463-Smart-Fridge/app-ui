import { ActivityIndicator } from "react-native"
import { View } from "react-native"

const Spinner = () => {
    return <View style={{  
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 50,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <ActivityIndicator size="large" color="paleturquoise" />
    </View>
}

export default Spinner;