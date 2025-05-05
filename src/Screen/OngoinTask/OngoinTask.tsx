import React from 'react';
import Container from '../../components/Container/Container';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';
import {View, StyleSheet} from 'react-native';
import TaskCard, {TaskData} from '../../components/TaskCard/TaskCard';
import {useAppSelector} from '../../Store/Store';

export const PARK_TASK: TaskData = {
  type: 'PARK',
  description: 'Park the vehicle safely in the designated area.',
  name: 'Mr ABC',
  phone: '5501231232131',
  brand: 'Toyota',
  model: 'Corolla',
  plate: 'QW1212121',
  location: 'Main Gate, Dubai.',
  startTime: '2025-05-02T09:02:00Z',
  duration: 30,
  instructions: 'Please park in the designated area.',
};

export const RETRIEVE_TASK: TaskData = {
  type: 'RETRIEVE',
  description: 'Retrieve the vehicle from parking.',
  name: 'Ms XYZ',
  phone: '550987654321',
  brand: 'Honda',
  model: 'Civic',
  plate: 'AE2020XYZ',
  location: 'Exit Gate, Dubai.',
  startTime: '2025-05-02T10:15:00Z',
  duration: 20,
  instructions: '',
};

// const TASK_FLAG_KEY = 'LAST_TASK_TYPE';
const OngoinTask = () => {
  // const [newTaskData, setNewTaskData] = React.useState<TaskData | null>(null);
  // const [newTaskNotification, setNewTaskNotification] = React.useState(false);
  // const [taskToShow, setTaskToShow] = React.useState<TaskData | null>(null);

  const {newTaskData} = useAppSelector(state => state.globalSlice) as {
    newTaskData: TaskData | null;
  };

  return (
    <Container>
      <View style={styles.container}>
        <TaskCard data={newTaskData || null} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING_SCREEN_HORIZONTAL,
  },
});

export default OngoinTask;
