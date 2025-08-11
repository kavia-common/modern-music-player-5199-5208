#!/bin/bash
cd /home/kavia/workspace/code-generation/modern-music-player-5199-5208/music_player_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

