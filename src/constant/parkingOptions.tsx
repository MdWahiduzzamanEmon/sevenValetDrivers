import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const PARKING_OPTIONS = [
  {
    label: 'Club',
    value: 'club',
    icon: (
      <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
    ),
  },
  {
    label: 'Afghan Parking',
    value: 'afghan_parking',
    icon: <MaterialCommunityIcons name="car" size={24} color="#fff" />,
  },
  {
    label: 'VIP Parking',
    value: 'vip_parking',
    icon: <MaterialCommunityIcons name="star" size={24} color="#fff" />,
  },
];
