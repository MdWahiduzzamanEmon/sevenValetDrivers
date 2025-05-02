import React from 'react';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';

export const ongoingTasks = [
  {
    id: 'Val534624vvv',
    brand: 'Toyota',
    model: 'Corolla',
    plate: '3A456W',
    duration: '4 m',
    action: 'PARK',
    status: 'Completed',
  },
  {
    id: '2',
    brand: 'Nissan',
    model: 'Altima',
    plate: '3A456W',
    duration: '10 m',
    action: 'RETRIEVE',
    status: 'Cancelled',
  },
  {
    id: '3',
    brand: 'Honda',
    model: 'Civic',
    plate: '3A456W',
    duration: '5 m',
    action: 'PARK',
    status: 'Ongoing',
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Focus',
    plate: '3A456W',
    duration: '7 m',
    action: 'RETRIEVE',
    status: 'Completed',
  },
];

const OngoinTask = ({...props}) => {
  const title = props.route.name;
  console.log('title', props);
  return (
    <Container>
      <TextWrapper
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 20,
        }}>
        {title}
      </TextWrapper>
    </Container>
  );
};

export default OngoinTask;
