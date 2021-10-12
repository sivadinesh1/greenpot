import styled from 'styled-components'
import React, { useState, useEffect } from 'react';
import Image from 'next/image'

const Header = styled.div`
        padding:20px;
        color:${props => props.color};
        font-size:20px;
        text-align: ${props => props.alignment};
        `;

const Content = styled.div`
        margin-top:40px;
        padding:20px;
        color:black;
        font-size:20px;
        `;

const HeaderCom = (props) => {
  // const [data,setData]=useState(props.data)
  const { company, content, imageUrl, backgroundImage, key } = props;
  let defaultUrl = "https://res.cloudinary.com/sanjayaalam/image/upload/v1623824061/bei5qfeikwisuvmi4t3c.jpg"

  return (
    <>
      <Header color="red" alignment="center">{company}</Header>
      <div style={{
        backgroundImage: `url(${backgroundImage === undefined ? defaultUrl : backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        //   height: "100vh",
      }}
        key={key}>

        <Content>{content}</Content>
      </div>
      <div id="image">
        <Image
          src={imageUrl === undefined ? defaultUrl : imageUrl}
          alt="Picture of the author"
          width={300}
          height={300} />
      </div>

    </>
  );
}

export default HeaderCom;