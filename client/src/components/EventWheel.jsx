import React, { useState } from 'react';
import { useGameStore } from '../game/state/gameStore';

const WHEEL_SIZE = 300;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 10;

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', x, y,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z',
  ].join(' ');
}

const EventWheel = ({ onClose, onEventSelected }) => {
  const { eventTypes } = useGameStore();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const spinDegrees = 720 + Math.random() * 720;
    const newRotation = rotation + spinDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const segmentSize = 360 / eventTypes.length;
      const selectedIndex = Math.floor((360 - normalizedRotation + segmentSize / 2) % 360 / segmentSize);
      const selected = eventTypes[selectedIndex];

      setSelectedEvent(selected);

      setTimeout(() => {
        if (onEventSelected) onEventSelected(selected);
        setSpinning(false);
      }, 2500);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 w-[420px] text-center relative z-10">
        <h2 className="text-2xl font-bold mb-4">Event Wheel</h2>

        <div className="relative w-[300px] h-[300px] mx-auto mb-4">
          {/* Pointer */}
        <div className="absolute -top left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-600" />
        </div>

          {/* SVG Wheel */}
          <svg
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            className="transition-transform duration-[3s] ease-out mx-auto z-10 relative"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {eventTypes.map((event, index) => {
              const segmentSize = 360 / eventTypes.length;
              const startAngle = index * segmentSize;
              const endAngle = startAngle + segmentSize;
              const path = describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle);
              const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.6, startAngle + segmentSize / 2);

              return (
                <g key={event.id}>
                  <path d={path} fill={event.color} />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {event.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mb-4">
          {selectedEvent ? (
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-lg">{selectedEvent.name}</h3>
              <p className="text-gray-700">{selectedEvent.description}</p>
            </div>
          ) : (
            <p className="text-gray-500">Spin the wheel to get a random event!</p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
          <button
            className={`btn ${spinning ? 'btn-disabled' : 'btn-accent'}`}
            onClick={spinWheel}
            disabled={spinning}
          >
            {spinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventWheel;
