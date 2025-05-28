import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

type Movie = {
  id: string;
  title: string;
  posterUrl: string;
};

type MovieCarouselProps = {
  movies: Movie[];
};

const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  return (
    <View style={styles.container}>
      <Carousel
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        data={movies}
        loop
        autoPlay={false}
        scrollAnimationDuration={500}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.posterUrl }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#222',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    backgroundColor: '#111',
  },
});

export default MovieCarousel;
