/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {FlatList, StyleSheet, View} from 'react-native';
import {Card} from 'react-native-paper';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';

// data.ts
export const completedTasks = [
  {
    id: '1',
    maker: 'Toyota',
    model: 'Corolla',
    plate: '3A456W',
    duration: '4 m',
    action: 'PARK',
  },
  {
    id: '2',
    maker: 'Nissan',
    model: 'Altima',
    plate: '3A456W',
    duration: '10 m',
    action: 'RETRIEVE',
  },
  {
    id: '3',
    maker: 'Honda',
    model: 'Civic',
    plate: '3A456W',
    duration: '5 m',
    action: 'PARK',
  },
  {
    id: '4',
    maker: 'Ford',
    model: 'Focus',
    plate: '3A456W',
    duration: '7 m',
    action: 'RETRIEVE',
  },
];

const CompletedTask = ({...props}) => {
  const title = props.route.name;
  console.log('title', props);

  const PARK_COLOR = '#EF4444';
  const RETRIEVE_COLOR = '#FB923C';
  return (
    <Container>
      <View
        style={{
          paddingHorizontal: PADDING_SCREEN_HORIZONTAL,
          paddingBottom: 40,
          marginTop: 20,
        }}>
        <TextWrapper style={styles.header}>Completed Tasks</TextWrapper>
        <FlatList
          data={completedTasks}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <Animated.View entering={FadeInUp.delay(index * 200)}>
              <Card style={styles.card}>
                <Card.Content style={styles.content}>
                  <View style={styles.info}>
                    <TextWrapper style={styles.title}>
                      Car Maker: {item.maker}
                    </TextWrapper>
                    <TextWrapper>Model: {item.model}</TextWrapper>
                    <TextWrapper>Plate No.: {item.plate}</TextWrapper>
                  </View>
                  <View
                    style={[
                      styles.durationBox,
                      {
                        backgroundColor:
                          item?.action === 'PARK' ? PARK_COLOR : RETRIEVE_COLOR,
                      },
                    ]}>
                    <TextWrapper style={styles.durationText}>
                      {item.duration}
                    </TextWrapper>
                  </View>
                </Card.Content>
                {/* //line horizontal */}
                <View style={styles.line} />
                <Card.Content>
                  <TextWrapper style={styles.actionText}>
                    {item.action}
                  </TextWrapper>
                </Card.Content>
              </Card>
            </Animated.View>
          )}
        />
      </View>
    </Container>
  );
};

export default CompletedTask;

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#3F3F3F',
    borderRadius: 16,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  durationBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  durationText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionText: {
    color: '#D9FF00',
    fontWeight: 'bold',
  },

  line: {
    height: 1,
    backgroundColor: '#dfdfdf',
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
