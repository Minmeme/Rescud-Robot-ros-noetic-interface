import React from "react";

interface ThreeVectorProps {
  length1: number;
  dergee1: number;
  color1: string;
}

const ThreeVector: React.FC<ThreeVectorProps> = ({ length1, dergee1, color1 }) => {
  const radians1 = (dergee1 * Math.PI) / 180;
  const x1 = length1 * Math.cos(radians1);
  const y1 = -length1 * Math.sin(radians1); // Negative because SVG Y-axis is inverted

  return (
    <div>
      <svg width="300" height="300">
        {/* ✅ ใช้ค่าจาก ROS ในการกำหนดขนาดและมุม */}
        <line
          x1="150"
          y1="250"
          x2={150 + x1}
          y2={250 + y1}
          stroke={color1}
          strokeWidth="2"
        />
        <circle cx="150" cy="250" r="3" fill="black" /> {/* Origin */}
      </svg>
      <p>Base Angle: {dergee1}°</p>
      {/* <p>Arm Length: {length1}px</p> */}
    </div>
  );
};

export default ThreeVector;
