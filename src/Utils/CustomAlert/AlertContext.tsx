import React, {createContext, useContext, useState, useCallback} from 'react';
import CustomAlert from './CustomAlert';

interface AlertContextType {
  showAlert: (
    title: string,
    message: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    options?: {
      actionLabel?: string;
      onAction?: () => void;
    },
  ) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [alert, setAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    actionLabel?: string;
    onAction?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = useCallback(
    (
      title: string,
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      options?: {actionLabel?: string; onAction?: () => void},
    ) => {
      setAlert({
        visible: true,
        title,
        message,
        type,
        ...options,
      });
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlert(prev => ({...prev, visible: false}));
  }, []);

  return (
    <AlertContext.Provider value={{showAlert, hideAlert}}>
      {children}
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={hideAlert}
        actionLabel={alert.actionLabel}
        onAction={alert.onAction}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
