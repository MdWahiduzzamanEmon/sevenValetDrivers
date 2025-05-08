import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Container from '../../components/Container/Container';
import TaskCard from '../../components/TaskCard/TaskCard';
import {useAppSelector} from '../../Store/Store';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';
import type {TaskData} from '../../components/TaskCard/TaskCard';

const OngoinTask = () => {
  const {newTaskData} = useAppSelector(state => state.globalSlice);

  const normalizedTaskData = useMemo(() => {
    if (!newTaskData) return null;

    return {
      ...newTaskData,
      taskType: newTaskData.taskType === 'Parking' ? 'ParkIn' : 'ParkOut',
    } as TaskData;
  }, [newTaskData]) as TaskData;

  return (
    <Container>
      <View style={styles.container}>
        <TaskCard data={normalizedTaskData} />
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
