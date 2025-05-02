import React from 'react';
import Container from '../../components/Container/Container';
import TextWrapper from '../../Utils/TextWrapper/TextWrapper';

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
