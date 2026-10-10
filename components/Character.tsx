
import React from 'react';
import { BUS_IMAGE_URL } from '../constants';

interface CharacterProps {
  position: 'start' | 'crossing' | 'crossed' | 'drivingOff';
  isResetting: boolean;
  onClick?: () => void; // Added onClick prop
}

const Character: React.FC<CharacterProps> = ({ position, isResetting, onClick }) => {
  let positionClass = 'left-[1%]'; // Start
  let scaleClass = 'scale-100'; // Default scale

  switch (position) {
    case 'crossing':
      positionClass = 'left-[45%]'; 
      break;
    case 'crossed':
      positionClass = 'left-[85%]'; 
      break;
    case 'drivingOff':
      positionClass = 'left-[110%]';
      scaleClass = 'scale-[1.1]'; // Scale up by 10% as it drives off
      break;
    default: // 'start'
      positionClass = 'left-[1%]';
      break;
  }

  // If resetting, jump instantly to off-screen left without a transition
  if (isResetting) {
    positionClass = 'left-[-50%]';
    scaleClass = 'scale-100'; // Ensure it's normal scale when resetting or off-screen
  }

  const getDuration = () => {
    switch (position) {
      case 'start':
        return '1000ms'; // Driving on screen
      case 'crossed':
        return '1500ms'; // Crossing the bridge
      case 'drivingOff':
        return '500ms'; // Driving off screen
      default:
        return '1500ms';
    }
  };

  return (
    <div 
      className={`absolute bottom-[115px] z-30 ${isResetting ? 'duration-0' : 'transition-all ease-in-out' } ${positionClass} ${scaleClass} flex flex-col items-center`}
      style={{ transitionDuration: isResetting ? '0ms' : getDuration() }}
    >
      <img 
        src={BUS_IMAGE_URL} 
        alt="School Bus" 
        className="w-72 h-auto object-contain animate-bus-drive drop-shadow-xl cursor-pointer" // Added cursor-pointer
        onClick={onClick} // Applied onClick handler
      />
      {/* Shadow */}
      <div className="w-52 h-3 bg-black opacity-20 rounded-full blur-md -mt-5"></div>
    </div>
  );
};

export default Character;