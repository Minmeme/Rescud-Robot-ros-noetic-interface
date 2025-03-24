import React, { useState } from 'react';

interface VectorPairProps {
  length1: number;
  length2: number;
  color1: string;
  color2: string;

  length3: number;
  length4: number;
  color3: string;
  color4: string;

  dergee1: number;
  dergee2: number;
  dergee3: number;
  dergee4: number;
}

const VectorPair: React.FC<VectorPairProps> = ({ length1, length2, length3, length4, dergee1, dergee2, dergee3, dergee4,color1, color2, color3, color4 }) => {
  const [angle1, setAngle1] = useState(Math.min(180, dergee1));
  const [angle2, setAngle2] = useState(Math.min(180, dergee2));
  const [angle3, setAngle3] = useState(Math.min(180, dergee3));
  const [angle4, setAngle4] = useState(Math.min(180, dergee4));

  // Convert angles to radians
  const radians1 = (angle1 * Math.PI) / 180;
  const radians2 = (angle2 * Math.PI) / 180;
  const radians3 = (angle3 * Math.PI) / 90;
  const radians4 = (angle4 * Math.PI) ;

  // Calculate the endpoints for the first vector
  const x1 = length1 * Math.cos(radians1);
  const y1 = -length1 * Math.sin(radians1); // Negative because SVG Y-axis is inverted

  // Calculate the endpoints for the second vector, starting from the end of the first
  const x2 = length2 * Math.cos(radians2);
  const y2 = -length2 * Math.sin(radians2);

  // Calculate the endpoints for the third vector starting at the origin again
  const x3 = length3 * Math.cos(radians3);
  const y3 = -length3 * Math.sin(radians3);

  // Calculate the endpoints for the fourth vector, starting from the end of the third
  const x4 = length4 * Math.cos(radians4);
  const y4 = -length4 * Math.sin(radians4);

  return (
    <div>
      <svg width="500" height="300">
        {/* Draw the first vector from the origin */}
        <line
          x1="250"
          y1="200"
          x2={250 + x1}
          y2={200 + y1}
          stroke={color1}
          strokeWidth="2"
        />
        {/* Draw the second vector connected to the end of the first */}
        <line
          x1={250 + x1}
          y1={200 + y1}
          x2={250 + x1 + x2}
          y2={200 + y1 + y2}
          stroke={color2}
          strokeWidth="2"
        />
        {/* Draw the third vector from the origin */}
        <line
          x1="350"
          y1="250"
          x2={350 + x3}
          y2={250 + y3}
          stroke={color3}
          strokeWidth="2"
        />
        
        {/* Draw the fourth vector connected to the end of the third */}
        <line
          x1="350"
          y1="250"
          x2={350 + x4}
          y2={250 + y4}
          stroke={color4}
          strokeWidth="2"
        />
        <circle cx="250" cy="200" r="3" fill="black" /> {/* Origin for first vector */}
        <circle cx={250 + x1} cy={200 + y1} r="3" fill="red" /> {/* Connection Point for first vectors */}
        <circle cx="350" cy="250" r="3" fill="black" /> {/* Origin for second vector */}
        <circle cx="350" cy="250" r="3" fill="black" /> {/* Origin for second vector */}
      </svg>
      <p>{dergee1},{dergee2},{dergee3},{dergee4}</p>
    </div>

  );
};

export default VectorPair;
