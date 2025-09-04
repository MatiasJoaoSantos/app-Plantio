import { StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export const PlantIcon = () => (
    <Svg
        height="24"
        width="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a" // green-600
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={styles.plantIcon}
    >
        <Path d="M7 10h10" />
        <Path d="M12 2a2.99 2.99 0 0 0-2.5 5.23A2.99 2.99 0 0 0 12 10a2.99 2.99 0 0 0 2.5-4.77A2.99 2.99 0 0 0 12 2z" />
        <Path d="M12 10v12" />
        <Path d="M16 14c-4.2 0-4.2-4-8.4 0" />
    </Svg>
);

export const LocationIcon = () => (
    <Svg
        height="16"
        width="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563eb" // blue-600
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <Circle cx="12" cy="10" r="3" />
    </Svg>
);

export const TimelineIcon = ({ phase }) => {
    const icons = {
        Plantio: '🌱',
        Irrigação: '💧',
        Adubação: '🧪',
        Colheita: '🌾'
    };
    return <Text style={styles.timelineIcon}>{icons[phase] || '📄'}</Text>;
};

const styles = StyleSheet.create({
    plantIcon: {
        marginRight: 8,
    },
    timelineIcon: {
        fontSize: 24,
        marginRight: 16,
    }
});
