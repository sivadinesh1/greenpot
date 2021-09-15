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
    const [data,setData]=useState(props.data)
    console.log("contet data--->",data)

    return(
        <>
        <Header color={data.content[0].style.color} alignment={data.content[0].style.alignment}>{data.content[0].value}</Header>
        <Content>{data.content[1].value}</Content>
        </>
    );
}

export default HeaderCom;