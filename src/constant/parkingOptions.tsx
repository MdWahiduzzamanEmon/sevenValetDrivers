import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const PARKING_OPTIONS = [
  {
    label: 'Club',
    value: 'Club',
    icon: (
      <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
    ),
  },
  {
    label: 'Afghan Parking',
    value: 'Afghan Parking',
    icon: <MaterialCommunityIcons name="car" size={24} color="#fff" />,
  },
  {
    label: 'VIP Parking',
    value: 'VIP Parking',
    icon: <MaterialCommunityIcons name="star" size={24} color="#fff" />,
  },
];
