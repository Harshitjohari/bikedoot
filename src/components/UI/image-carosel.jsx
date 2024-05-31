import React, { useRef, useEffect } from 'react';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth - 25;

const MyCarousel = ({ entries }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      carouselRef.current.snapToNext();
    }, 10000); 

    return () => {
      clearInterval(timer);
    };
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item.banner }} style={styles.image} />
      </View>
    );
  };

  return (
    <Carousel
      ref={carouselRef}
      data={entries}
      renderItem={renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      layout={'default'} // Set layout to 'stack'
      layoutCardOffset={10} // Adjust card offset
      useScrollView={true}
      autoplay={true} 
      // autoplayInterval={10000}
      loop={true}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    marginLeft: -10,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
});

export default MyCarousel;

