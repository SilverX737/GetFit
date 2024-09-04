import React from "react";
import SectionWrapper from './SectionWrapper'

const Workout = (props) => {
    const { workout } = props;
    return(
        <SectionWrapper id={'workout'} header={"welcome to"} title={['The', 'DANGER', 'zone']}>

        </SectionWrapper>
    )
}

export default Workout;