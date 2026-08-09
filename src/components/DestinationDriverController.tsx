import {useState} from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { busLineService } from "../api/busLineService";
import useTracking from "../hooks/useTracking";
import apiClient from "../api/client";

export default function DestinationDriverController() {
    

     
    const [busLine, setBusLine] = useState(1);

    const destinations = busLineService.getAll().then(lines => {
        return lines.map(line => ({ id: line.id, name: line.name }));
    }).catch(err => {
        console.error("Error fetching bus lines:", err);
        return [];
    });

    const { sendLocation, isConnected } = useTracking({
        busLineId: busLine,
        onBusUpdate: (msg) => console.log("bus update:", msg),
    });

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setBusLine(prev => prev + 1)}>
                <Text>Destination</Text>
            </TouchableOpacity>

            
        </View>
    );

}
