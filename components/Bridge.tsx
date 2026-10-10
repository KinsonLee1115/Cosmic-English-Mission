import React from 'react';
import { BridgeState } from '../types';
import { Hammer } from 'lucide-react';

interface BridgeProps {
  state: BridgeState;
  correctAnswer: string;
}

const Bridge: React.FC<BridgeProps> = ({ state, correctAnswer }) => {
  const isFixed = state === BridgeState.FIXED;
  const isFixing = state === BridgeState.FIXING;
  const isBroken = state === BridgeState.BROKEN;

  return (
    <div className="absolute bottom-0 left-0 w-full h-32">
      {/* Water */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] h-24 bg-blue-500/80 z-0 overflow-hidden">
         <div 
          className="absolute -top-4 left-0 w-full h-12 bg-no-repeat bg-center opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 20'%3E%3Cpath d='M0 10 Q 20 0, 40 10 T 80 10' stroke='white' fill='transparent' stroke-width='2'/%3E%3C/svg%3E")`,
            animation: 'wave 4s linear infinite',
            backgroundSize: '80px 20px',
          }}
        ></div>
      </div>
       <style>{`
        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: -80px; }
        }
      `}</style>

      {/* Left Bank */}
      <div className="absolute right-[85%] bottom-0 w-[50vw] h-full bg-green-600 rounded-tr-3xl z-10 border-r-4 border-green-800"></div>

      {/* Right Bank */}
      <div className="absolute left-[85%] bottom-0 w-[50vw] h-full bg-green-600 rounded-tl-3xl z-10 border-l-4 border-green-800"></div>

      {/* Bridge Structure */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-24 z-20 flex items-start justify-center">
        
        {/* Left Span */}
        <div className="h-4 bg-amber-700 w-[35%] rounded-l-lg shadow-lg relative flex space-x-2 px-1">
             {/* Planks */}
            <div className="h-full w-2 bg-amber-900/30"></div>
            <div className="h-full w-2 bg-amber-900/30"></div>
            <div className="h-full w-2 bg-amber-900/30"></div>
            {/* Handrail */}
            <div className="absolute -top-8 left-0 w-full h-2 bg-amber-800 rounded-full"></div>
            <div className="absolute -top-8 left-[10%] w-1 h-8 bg-amber-800"></div>
            <div className="absolute -top-8 left-[50%] w-1 h-8 bg-amber-800"></div>
        </div>

        {/* The Gap / Center Span */}
        <div className="h-4 w-[30%] relative flex items-center justify-center">
           
           {/* The 'Key' Plank */}
           <div className={`
                absolute -top-1 h-6 w-full 
                bg-yellow-500 rounded-lg shadow-xl border-2 border-yellow-700 
                flex items-center justify-center 
                z-20
                ${isBroken ? 'opacity-0' : ''}
                ${isFixing ? 'animate-drop-in animate-jiggle' : ''}
                ${isFixed ? 'opacity-100' : ''}
           `}>
                {/* Visual texture for planks */}
                <div className="absolute left-[33%] h-full w-[1px] bg-yellow-700/30"></div>
                <div className="absolute right-[33%] h-full w-[1px] bg-yellow-700/30"></div>
                
                <span className="text-amber-900 font-bold tracking-widest text-lg z-10">{correctAnswer}</span>
                
                {/* Hammer Animation Effect */}
                {isFixing && (
                    <div className="absolute -top-8 -right-4 text-slate-700 animate-hammer z-50">
                        <Hammer size={32} fill="currentColor" />
                    </div>
                )}

                {/* Sparkle/Dust Effect */}
                {isFixing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Create a few particles that burst outwards */}
                    <div className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ transform: 'translate(-20px, -5px)', animationDelay: '0.1s' }}></div>
                    <div className="absolute w-3 h-3 bg-white rounded-full animate-sparkle" style={{ transform: 'translate(15px, 10px)' }}></div>
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle" style={{ transform: 'translate(25px, -8px)', animationDelay: '0.15s' }}></div>
                    <div className="absolute w-2.5 h-2.5 bg-white/80 rounded-full animate-sparkle" style={{ transform: 'translate(-10px, 12px)', animationDelay: '0.05s' }}></div>
                  </div>
                )}
           </div>
           
           {/* Handrail completes when fixed */}
           <div className={`absolute -top-8 w-full h-2 bg-amber-800 rounded-full transition-all duration-500 delay-300 ${isFixed ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
        </div>

        {/* Right Span */}
        <div className="h-4 bg-amber-700 w-[35%] rounded-r-lg shadow-lg relative flex space-x-2 px-1 justify-end">
            {/* Planks */}
            <div className="h-full w-2 bg-amber-900/30"></div>
            <div className="h-full w-2 bg-amber-900/30"></div>
            <div className="h-full w-2 bg-amber-900/30"></div>
            {/* Handrail */}
            <div className="absolute -top-8 right-0 w-full h-2 bg-amber-800 rounded-full"></div>
             <div className="absolute -top-8 right-[10%] w-1 h-8 bg-amber-800"></div>
            <div className="absolute -top-8 right-[50%] w-1 h-8 bg-amber-800"></div>
        </div>

      </div>
    </div>
  );
};

export default Bridge;