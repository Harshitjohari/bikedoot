import React, { useRef, useState } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
const sliderWidth = Dimensions.get('window').width;
const itemWidth = sliderWidth - 10;

const MyCarousel = ({ entries }) => {
  const carouselRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: item.banner }} style={{ height: 200, width: itemWidth, resizeMode: 'contain' }} />
      </View>
    );
  };

  return (
    <>
    <Carousel
      autoplay={true}
      enableMomentum={false}
      lockScrollWhileSnapping={true}
      showsHorizontalScrollIndicator={false}
      ref={carouselRef}
      data={entries}
      renderItem={renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      onSnapToItem={(index) => setActiveSlide(index)}
    />
    <Pagination
              dotsLength={entries.length}
              activeDotIndex={activeSlide}
              containerStyle={{ marginTop:-15,marginBottom:-20 }}
              dotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  backgroundColor: '#000'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
            </>
  );
};

// Adjust this according to your needs

const styles = StyleSheet.create({
  slide: {
    marginLeft: -10,
    height: 200, // Adjust this according to your needs
    borderRadius: 10, // Example border radius
  },
  title: {
    fontSize: 20,
    color: 'black', // Example text color
  },
});

export default MyCarousel;
