import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocation = (
  onLocationUpdate?: (loc: Location.LocationObject) => void
) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5, // Plus précis pour le bus
        },
        (newLocation) => {
          setLocation(newLocation);
          // Si une fonction d'envoi est fournie, on l'exécute
          if (onLocationUpdate) {
            onLocationUpdate(newLocation);
          }
        }
      );
    })();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [onLocationUpdate]);

  return { location };
};
