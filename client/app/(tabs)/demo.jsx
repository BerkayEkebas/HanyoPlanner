import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Sample data for Korea
const PLACES_DATA = [
  {
    id: 1,
    name: 'Gyeongbokgung Palace',
    category: 'Historical Site',
    image: 'https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'The largest of the Five Grand Palaces built during the Joseon Dynasty, featuring beautiful traditional architecture and royal guard ceremonies.',
    rating: 4.8,
    distance: '1.2 km'
  },
  {
    id: 2,
    name: 'Bukchon Hanok Village',
    category: 'Traditional Village',
    image: 'https://images.unsplash.com/photo-1598394071385-5eeb3c7d861e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'A traditional Korean village with hundreds of hanoks (traditional Korean houses) dating back to the Joseon Dynasty.',
    rating: 4.7,
    distance: '0.8 km'
  },
  {
    id: 3,
    name: 'Myeongdong Shopping Street',
    category: 'Shopping & Entertainment',
    image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Seoul\'s premier shopping and entertainment district, famous for fashion stores, cosmetics, and street food.',
    rating: 4.6,
    distance: '1.5 km'
  },
  {
    id: 4,
    name: 'N Seoul Tower',
    category: 'Landmark & Views',
    image: 'https://images.unsplash.com/photo-1597237323585-c6cb3ca6cc93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Iconic communications tower offering panoramic views of Seoul, romantic atmosphere, and love locks.',
    rating: 4.9,
    distance: '2.3 km'
  },
  {
    id: 5,
    name: 'Hongdae Street Art',
    category: 'Arts & Culture',
    image: 'https://images.unsplash.com/photo-1573805401365-32d45ff5d723?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Vibrant neighborhood known for urban arts, indie music culture, street performances, and trendy cafes.',
    rating: 4.5,
    distance: '3.1 km'
  }
];

const RESTAURANTS_DATA = [
  {
    id: 1,
    name: 'Gwangjang Market Food Stalls',
    category: 'Korean Street Food',
    image: 'https://images.unsplash.com/photo-1569050469792-5049e32d9663?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Traditional market famous for authentic Korean street food like bindaetteok (mung bean pancakes) and mayak gimbap.',
    rating: 4.7,
    distance: '0.9 km',
    price: '₩₩'
  },
  {
    id: 2,
    name: 'Jinmi Bapsang',
    category: 'Traditional Korean',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Authentic Korean restaurant serving traditional dishes with homemade side dishes and family recipes.',
    rating: 4.8,
    distance: '1.2 km',
    price: '₩₩₩'
  },
  {
    id: 3,
    name: 'Myeongdong Kyoja',
    category: 'Korean Noodles',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Famous for kalguksu (hand-cut noodle soup) and mandu (dumplings), a must-try Seoul institution since 1966.',
    rating: 4.6,
    distance: '1.4 km',
    price: '₩₩'
  },
  {
    id: 4,
    name: 'Mapo Galmaegi',
    category: 'Korean BBQ',
    image: 'https://images.unsplash.com/photo-1597810745587-8a7c6c6d51ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Popular Korean BBQ spot specializing in high-quality pork and beef with authentic side dishes and soju.',
    rating: 4.9,
    distance: '2.0 km',
    price: '₩₩₩'
  },
  {
    id: 5,
    name: 'Isaac Toast',
    category: 'Korean Breakfast',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Famous Korean toast chain perfect for breakfast, featuring unique sweet and savory toast combinations.',
    rating: 4.4,
    distance: '0.5 km',
    price: '₩'
  }
];

const Demo = () => {
  const [activeTab, setActiveTab] = useState('places');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPlaces, setLikedPlaces] = useState([]);
  
  const data = activeTab === 'places' ? PLACES_DATA : RESTAURANTS_DATA;
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        // Swipe right - LIKE
        Animated.spring(position, {
          toValue: { x: width + 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          const likedItem = data[currentIndex];
          setLikedPlaces([...likedPlaces, likedItem]);
          setCurrentIndex(currentIndex + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else if (gestureState.dx < -120) {
        // Swipe left - PASS
        Animated.spring(position, {
          toValue: { x: -width - 100, y: gestureState.dy },
          useNativeDriver: true
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: true
        }).start();
      }
    }
  });

  const renderCard = (item, index) => {
    if (index < currentIndex) {
      return null;
    }
    
    if (index === currentIndex) {
      return (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotate }
              ]
            }
          ]}
          key={item.id}
        >
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
            </View>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.distance}>{item.distance}</Text>
              {item.price && <Text style={styles.price}>{item.price}</Text>}
            </View>
          </View>
          
          <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeText}>PASS</Text>
          </Animated.View>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          style={[
            styles.card,
            styles.nextCard,
            {
              opacity: nextCardOpacity,
              transform: [
                { scale: 1 - 0.05 * (index - currentIndex) }
              ]
            }
          ]}
          key={item.id}
        >
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>
            </View>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.distance}>{item.distance}</Text>
              {item.price && <Text style={styles.price}>{item.price}</Text>}
            </View>
          </View>
        </Animated.View>
      );
    }
  };

  const handleLike = () => {
    Animated.spring(position, {
      toValue: { x: width + 100, y: 0 },
      useNativeDriver: true
    }).start(() => {
      const likedItem = data[currentIndex];
      setLikedPlaces([...likedPlaces, likedItem]);
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleDislike = () => {
    Animated.spring(position, {
      toValue: { x: -width - 100, y: 0 },
      useNativeDriver: true
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setLikedPlaces([]);
    position.setValue({ x: 0, y: 0 });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Seoul Discovery</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'places' ? 'Places to Visit' : 'Food & Restaurants'}
          </Text>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'places' && styles.activeTab]}
            onPress={() => {
              setActiveTab('places');
              resetCards();
            }}
          >
            <Text style={[styles.tabText, activeTab === 'places' && styles.activeTabText]}>
              Places to Visit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
            onPress={() => {
              setActiveTab('restaurants');
              resetCards();
            }}
          >
            <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
              Food & Restaurants
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContainer}>
          {currentIndex < data.length ? (
            data.map((item, index) => renderCard(item, index)).reverse()
          ) : (
            <View style={styles.noMoreCards}>
              <Text style={styles.noMoreCardsText}>
                You ve seen all recommendations!
              </Text>
              <Text style={styles.noMoreCardsSubtext}>
                Your favorites: {likedPlaces.length}
              </Text>
              <TouchableOpacity style={styles.resetButton} onPress={resetCards}>
                <Text style={styles.resetButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {currentIndex < data.length && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.dislikeButton} onPress={handleDislike}>
              <Text style={styles.dislikeButtonText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
              <Text style={styles.likeButtonText}>♥</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {currentIndex} / {data.length}
          </Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a11cb'
  },
  safeArea: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    padding: 5,
    marginHorizontal: 20,
    marginBottom: 20
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: 'white'
  },
  tabText: {
    color: 'white',
    fontWeight: '600'
  },
  activeTabText: {
    color: '#6a11cb'
  },
  cardContainer: {
    width: width * 0.9,
    height: height * 0.6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  nextCard: {
    top: 10 * (1 - 0.95)
  },
  cardImage: {
    width: '100%',
    height: '65%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  cardContent: {
    padding: 20,
    height: '35%',
    justifyContent: 'space-between'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1
  },
  ratingContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  cardCategory: {
    fontSize: 16,
    color: '#6a11cb',
    fontWeight: '600',
    marginTop: 5
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  distance: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500'
  },
  price: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600'
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }]
  },
  likeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }]
  },
  nopeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 30
  },
  dislikeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  dislikeButtonText: {
    fontSize: 30,
    color: '#F44336'
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  likeButtonText: {
    fontSize: 30,
    color: '#4CAF50'
  },
  noMoreCards: {
    alignItems: 'center',
    padding: 20
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10
  },
  noMoreCardsSubtext: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20
  },
  resetButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a11cb'
  },
  footer: {
    marginTop: 20,
    marginBottom: 10
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14
  }
});

export default Demo;