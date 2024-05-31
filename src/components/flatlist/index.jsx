import React from 'react';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import LoadingSpinner from '../UI/loading'
import EmptyState from '../empty-screen';

const FlatListContainer = (props) => {

  const { data,
    onEndReached,
    isLoading,
    renderItem,
    ListHeaderComponent,
    ListFooterComponent,
    containerStyle,
    horizontal = false,
    emptyMessage = "No data found",
    showEmaptyMessage = true
  } = props;

  if (isLoading)
    return <LoadingSpinner />

  return (
    <View style={containerStyle}>
      <FlatList
        horizontal={horizontal}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookingId}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={ListHeaderComponent} // Add header
        ListFooterComponent={ListFooterComponent} // Add footer
        ListFooterComponentStyle={{ marginBottom: 10 }} // Adjust as needed
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (showEmaptyMessage)
            return (<EmptyState message={emptyMessage} />)
          else
            return null;

        }}
        {...props}
      />
    </View>
  );
};

export default FlatListContainer;
