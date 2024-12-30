import React, { useState, useEffect, useRef, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    Animated,
} from 'react-native';
import imageDataSet from './imageDataset';
import { incrementClickCount } from '../store/counterSlice';
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';

const endpoints = [
    {
        type: 'Lotion',
        url: 'https://api.fda.gov/drug/drugsfda.json?search=products.dosage_form:"LOTION"&limit=5',
    },
    {
        type: 'Tablet',
        url: 'https://api.fda.gov/drug/drugsfda.json?search=products.dosage_form:"TABLET"&limit=6',
    },
    {
        type: 'Injectable',
        url: 'https://api.fda.gov/drug/drugsfda.json?search=products.dosage_form:"INJECTABLE"&limit=5',
    },
    {
        type: 'Gel',
        url: 'https://api.fda.gov/drug/drugsfda.json?search=products.dosage_form:"GEL"&limit=6',
    },
];

const HomeScreen = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ [key: string]: any[] }>({});
    const clickCount = useSelector((state: RootState) => state.counter.count);
    const dispatch = useDispatch();
    const bounceAnim = useRef(new Animated.Value(1)).current; // Animation value

    const bounce = (): void => {
        Animated.sequence([
            Animated.timing(bounceAnim, {
                toValue: 1.5, // Scale up
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
                toValue: 1, // Scale back to normal
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        const fetchAllData = async () => {
            const results: { [key: string]: any[] } = {};
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint.url);
                    const json = await response.json();
                    results[endpoint.type] = json.results || [];
                } catch (error) {
                    console.error(`Error fetching data for ${endpoint.type}`, error);
                }
            }
            setData(results);
            setLoading(false);
        };
        fetchAllData();
    }, []);

    useEffect(() => {
        if (clickCount > 0) {
            bounce(); // Trigger bounce effect
        }
    }, [clickCount]);


    const handleCardClick = () => {
        dispatch(incrementClickCount());
        if (clickCount > 0) {
            bounce(); // Trigger bounce effect
        }
    };

    interface RenderCardProps {
        item: any;
        type: string;
        handleCardClick: () => void;
        index: number;
    }

    const RenderCard = memo(({ item, type, handleCardClick, index }: RenderCardProps) => {
        const imageUrl = imageDataSet[type]?.[index]?.url || 'https://via.placeholder.com/200';


        return (
            <TouchableOpacity
                style={styles.cardContainer}
                key={item.application_number}
                onPress={handleCardClick}
            >
                <View style={styles.cardContent}>
                    <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                    <View style={styles.cardDetails}>
                        <Text style={styles.cardTitle}>{item.products[0]?.brand_name || 'Unknown Brand'}</Text>
                        <Text style={styles.cardSubtitle}>Sponsor: {item.sponsor_name || 'N/A'}</Text>
                        <Text style={styles.cardInfo}>
                            <Text style={styles.infoLabel}>Form:</Text> {item.products[0]?.dosage_form || 'N/A'}
                        </Text>
                        <Text style={styles.cardInfo}>
                            <Text style={styles.infoLabel}>Route:</Text> {item.products[0]?.route || 'N/A'}
                        </Text>
                        <Text style={styles.cardInfo}>
                            <Text style={styles.infoLabel}>Strength:</Text> {item.products[0]?.active_ingredients[0]?.strength || 'N/A'}
                        </Text>
                        <Text style={styles.cardInfo}>
                            <Text style={styles.infoLabel}>Status:</Text> {item.products[0]?.marketing_status || 'N/A'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    const renderSwippable = (type: string, items: ArrayLike<any> | null | undefined) => (
        <View key={String(type)} style={styles.swippableSection}>
            <Text style={styles.swippableTitle}>{String(type)}</Text>
            <FlatList
                data={items}
                renderItem={({ item, index }) => (
                    <RenderCard
                        item={item}
                        type={type}
                        handleCardClick={handleCardClick}
                        index={index}
                    />
                )}
                keyExtractor={(item, index) =>
                    item.application_number?.toString() || index.toString()
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={5}
                getItemLayout={(data, index) => ({
                    length: 240,
                    offset: 240 * index,
                    index,
                })}
            />
        </View>
    );


    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>FDA Products</Text>
                {Object.keys(data).map((type) => renderSwippable(type, data[type]))}
            </ScrollView>
            <Animated.View style={[styles.floatingButton, { transform: [{ scale: bounceAnim }] }]}>
                <TouchableOpacity onPress={handleCardClick}>
                    <Text style={styles.floatingButtonText}>{clickCount}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEBED',
        padding: 2,
    },
    scrollContent: {
        paddingBottom: 1, // Ensure space for floating button
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 2,
        color: '#006989',
    },
    swippableSection: {
        marginBottom: 20,
    },
    swippableTitle: {
        fontSize: 23,
        fontWeight: '900',
        color: '#01A7C2',
        marginBottom: 5,
        marginLeft: 10,
    },
    cardContainer: {
        margin: 10,
        marginBottom: 5,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#C1D0D7',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        width: 360,
    },
    cardContent: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    cardImage: {
        width: 200,
        height: 160,
        borderRadius: 15,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    cardDetails: {
        width: '100%',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#006989',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#01A7C2',
        textAlign: 'center',
        marginBottom: 8,
    },
    cardInfo: {
        fontSize: 17,
        color: '#555',
        marginVertical: 2,
        textAlign: 'left',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#006989',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#01A7C2',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 25,
        right: 20,
        backgroundColor: '#007BFF',
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    floatingButtonText: {
        fontSize: 30,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
