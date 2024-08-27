import React from 'react';
import { useXarrow } from 'react-xarrows';

const ComponentA = () => {
    return <div ref={useXarrow()} style={{background: 'lightblue'}}> Component A </div>;
};
  
const ComponentB = () => {
    return <div ref={useXarrow()} style={{background: 'lightgreen'}}> Component B </div>;
};
  
// In a different component
const ParentComponent= () => {
    return (
        <div>
            <ComponentA />
            <ComponentB />
        </div>
    )
}
export default ParentComponent;