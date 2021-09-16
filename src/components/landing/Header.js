import styled from 'styled-components'
import React, { useState, useEffect } from 'react';

        const Header=styled.div`
        padding:20px;
        color:${props => props.color};
        font-size:20px;
        text-align: ${props=>props.alignment};
        `;

        const Content=styled.div`
        margin-top:40px;
        padding:20px;
        color:black;
        font-size:20px;
        `;

const HeaderCom =(props) =>{
    // const [data,setData]=useState(props.data)
  const  {company,content} =props;

    return(
        <>
        <Header color="red" alignment="center">{company}</Header>
        <Content>{content}</Content>
        </>
    );
}

export default HeaderCom;