import React, { useEffect, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useAppStore } from '../state/app-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedView = Animated.createAnimatedComponent(View);

interface WorkingDarkModeToggleProps {
  screenWidth: number;
  screenHeight: number;
}

export const WorkingDarkModeToggle: React.FC<WorkingDarkModeToggleProps> = ({
  screenWidth,
  screenHeight,
}) => {
  const { isDarkMode, togglePosition, setDarkMode, setTogglePosition } = useAppStore();
  const insets = useSafeAreaInsets();
  
  const translateX = useSharedValue(20);
  const translateY = useSharedValue(20);
  
  const toggleSize = 50;
  
  // Calculate positions
  const positions = useMemo(() => ({
    bottomLeft: {
      x: 20,
      y: screenHeight - toggleSize - insets.bottom - 10  // Lower position
    },
    topLeft: {
      x: 20,
      y: insets.top + 20
    }
  }), [screenHeight, insets.bottom, insets.top, toggleSize]);

  // Update position when togglePosition changes
  useEffect(() => {
    const targetPos = togglePosition === 'bottom-left' ? positions.bottomLeft : positions.topLeft;
    translateX.value = withSpring(targetPos.x);
    translateY.value = withSpring(targetPos.y);
  }, [togglePosition, positions]);

  const updateTogglePosition = (newPos: 'bottom-left' | 'top-left') => {
    setTogglePosition(newPos);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context: any) => {
      translateX.value = Math.max(0, Math.min(screenWidth - toggleSize, context.startX + event.translationX));
      translateY.value = Math.max(insets.top, Math.min(screenHeight - toggleSize - insets.bottom, context.startY + event.translationY));
    },
    onEnd: () => {
      const currentY = translateY.value;
      const distanceToTop = Math.abs(currentY - positions.topLeft.y);
      const distanceToBottom = Math.abs(currentY - positions.bottomLeft.y);
      
      const newPosition: 'bottom-left' | 'top-left' = distanceToTop < distanceToBottom ? 'top-left' : 'bottom-left';
      const targetPos = newPosition === 'bottom-left' ? positions.bottomLeft : positions.topLeft;
      
      translateX.value = withSpring(targetPos.x);
      translateY.value = withSpring(targetPos.y);
      
      runOnJS(updateTogglePosition)(newPosition);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handleToggle = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} onHandlerStateChange={gestureHandler}>
      <AnimatedView
        style={[
          animatedStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
            width: toggleSize,
            height: toggleSize,
          }
        ]}
      >
        <Pressable
          onPress={handleToggle}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderWidth: 2,
            borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons
            name={isDarkMode ? "moon" : "sunny"}
            size={24}
            color={isDarkMode ? "#fbbf24" : "#374151"}
          />
        </Pressable>
      </AnimatedView>
    </PanGestureHandler>
  );
};