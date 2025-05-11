import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import {SCREEN_HEIGHT} from '../../config';
import useLocation from '../../Hooks/useLocation';
import {setClearTask} from '../../Store/feature/globalSlice';
import {useAppDispatch} from '../../Store/Store';
import {setTaskPrgressingTimer} from '../../Store/feature/Auth/authSlice';

const CompleteTaskComponent = ({
  user,
  completeTask,
  setStatus,
  showDialog,
  setShowDialog,
}: {
  user: any;
  completeTask: any;
  setStatus: any;
  showDialog: boolean;
  setShowDialog: any;
}) => {
  const dispatch = useAppDispatch();
  const {stopTracking, location} = useLocation();

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (showDialog) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showDialog, slideAnim]);

  //handle start task

  const confirmStart = async () => {
    setShowDialog(false);
    dispatch(setTaskPrgressingTimer(0));
    try {
      const taskData = {
        driverId: user.id,
        latitude: location?.latitude?.toString() || '',
        longitude: location?.longitude?.toString() || '',
        speed: location?.speed || 0,
        heading: location?.heading || 0,
      };

      const res = await completeTask(taskData).unwrap();
      console.log('res-complete task', res);
      setStatus('COMPLETED');
      //clear the task from the server
      dispatch(setClearTask());
      stopTracking();
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal transparent visible={showDialog} animationType="fade">
        <View style={styles.overlay}>
          <Animated.View
            style={[styles.dialog, {transform: [{translateY: slideAnim}]}]}>
            <Text style={styles.title}>Confirm Complete</Text>
            <Text style={styles.message}>
              Are you sure you want to complete the task?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDialog(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmStart}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  startButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  startText: {color: '#fff', fontSize: 18},

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  title: {fontSize: 20, fontWeight: '600', marginBottom: 10},
  message: {fontSize: 16, color: '#555', marginBottom: 20},

  buttonRow: {flexDirection: 'row', justifyContent: 'space-between'},
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  cancelText: {color: '#000', textAlign: 'center', fontWeight: '500'},
  confirmText: {color: '#fff', textAlign: 'center', fontWeight: '500'},
});

export default CompleteTaskComponent;
