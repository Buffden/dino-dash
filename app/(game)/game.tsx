import SimpleDinoGame from '@/components/game/SimpleDinoGame';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function GameScreen() {
  return (
    <>
      <StatusBar style="light" />
      <SimpleDinoGame />
    </>
  );
} 