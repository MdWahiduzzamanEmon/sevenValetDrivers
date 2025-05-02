import React from 'react';
import Container from '../../components/Container/Container';
import {FlatList, StyleSheet, View} from 'react-native';
import {Card} from 'react-native-paper';
import Animated, {FadeInUp} from 'react-native-reanimated';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';

export const pendingTasks = [
  {
    id: 'Val534624vvv',
    brand: 'Toyota',
    model: 'Corolla',
    plate: '3A456W',
    duration: '4 m',
    action: 'PARK',
    status: 'Pending',
  },
  {
    id: '2',
    brand: 'Nissan',
    model: 'Altima',
    plate: '3A456W',
    duration: '10 m',
    action: 'RETRIEVE',
    status: 'Pending',
  },
];
const Pending = ({...props}) => {
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
        }}>
        <TextWrapper style={styles.header}> {title} Tasks</TextWrapper>
        <FlatList
          data={pendingTasks}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <Animated.View entering={FadeInUp.delay(index * 200)}>
              <Card style={styles.card}>
                <Card.Content style={styles.content}>
                  <View style={styles.info}>
                    <TextWrapper style={styles.title}>
                      Task Id: {item.id}
                    </TextWrapper>
                    <TextWrapper style={styles.title}>
                      Brand: {item.brand}
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

                <Card.Content style={styles.cardFooterContent}>
                  <TextWrapper style={styles.actionText}>
                    {item.action}
                  </TextWrapper>

                  {/* //status  */}
                  <TextWrapper style={styles.statusText}>
                    {item.status}
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

export default Pending;

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

  cardFooterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusText: {
    //pending orange

    backgroundColor: '#FFA500',
    color: '#fff',
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
