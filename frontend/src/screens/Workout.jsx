import React from "react";
import SectionWrapper from '../components/SectionWrapper';
import ExerciseCard from '../components/ExerciseCard';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'

const Workout = (props) => {
    const { workout } = props;
    const navigate = useNavigate(); 

    
    const home = () => navigate('/');
    
    
    const goToGenerator = () => navigate('/generator');

    return (
        <SectionWrapper id={'workout'} header={"welcome to"} title={['The', 'DANGER', 'zone']}>
            <div className='flex flex-col gap-4'>
                {workout.map((exercise, i) => {
                    return (
                        <ExerciseCard i={i} exercise={exercise} key={i} />
                    );
                })}
            </div>
            <div className='flex gap-4 mt-4'>
            <Button func={home} text={"Go back to home page"}></Button>
            <Button func={goToGenerator} text={"Go back to Genrator page"}></Button>   
            </div>
        </SectionWrapper>
    );
};

export default Workout;
