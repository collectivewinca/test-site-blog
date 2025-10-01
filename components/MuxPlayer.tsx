import React from 'react';

interface MuxPlayerProps {
  playbackId: string;
  metadata?: {
    videoTitle?: string;
    videoDescription?: string;
  };
}

const MuxPlayer: React.FC<MuxPlayerProps> = ({ playbackId, metadata }) => {
  return (
    <div className="relative w-full aspect-video my-8">
      <iframe
        src={`https://player.mux.com/${playbackId}`}
        title={metadata?.videoTitle || 'Mux Video Player'}
        frameBorder="0"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default MuxPlayer;