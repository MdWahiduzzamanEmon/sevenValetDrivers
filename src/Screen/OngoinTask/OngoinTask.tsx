import React from 'react';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';
import {StyleSheet, View} from 'react-native';
import TaskCard, {TaskData} from '../../components/TaskCard/TaskCard';

// taskData.ts
export const taskData: TaskData = {
  type: 'PARK', // or 'RETRIEVE' or 'PARK'
  description: 'PARK',
  name: 'Mr ABC',
  phone: '5501231232131',
  brand: 'Toyota',
  model: 'Corolla',
  plate: 'QW1212121',
  location: 'Main Gate, Dubai.',
  startTime: '2025-05-02T09:02:00Z',
  duration: 30, // in minutes
  instructions: 'Please park in the designated area.',
};

const OngoinTask = ({...props}) => {
  const title = props.route.name;
  console.log('title', props);

  return (
    <Container>
      <View
        style={{
          paddingHorizontal: PADDING_SCREEN_HORIZONTAL,
          paddingBottom: 40,
        }}>
        <TextWrapper style={styles.header}> {title} Tasks</TextWrapper>

        <TaskCard data={taskData} />
      </View>
    </Container>
  );
};

export default OngoinTask;

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
