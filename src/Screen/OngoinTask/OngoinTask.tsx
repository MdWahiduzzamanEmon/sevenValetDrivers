import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Container from '../../components/Container/Container';
import TaskCard from '../../components/TaskCard/TaskCard';
import {useAppSelector} from '../../Store/Store';
import {PADDING_SCREEN_HORIZONTAL} from '../../config';
import type {TaskData} from '../../components/TaskCard/TaskCard';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';

const OngoinTask = () => {
  const {newTaskData, isLoadingTask} = useAppSelector(
    state => state.globalSlice,
  );

  const normalizedTaskData = useMemo(() => {
    if (!newTaskData) return null;

    return {
      ...newTaskData,
      taskType: newTaskData.taskType === 'Parking' ? 'ParkIn' : 'ParkOut',
    } as TaskData;
  }, [newTaskData]) as TaskData;
  // console.log('normalizedTaskData', isLoadingTask);

  return (
    <Container>
      <View style={styles.container}>
        {isLoadingTask ? (
          <TextWrapper style={styles.waitingText}>Loading your task...</TextWrapper>
        ) : (
          <TaskCard data={normalizedTaskData} />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING_SCREEN_HORIZONTAL,
  },
  waitingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },
});

export default OngoinTask;
