import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TechEvent } from '../state/app-store';
import { useAppStore } from '../state/app-store';
import { cn } from '../utils/cn';

interface SimpleEventCardProps {
  event: TechEvent;
}

export const SimpleEventCard: React.FC<SimpleEventCardProps> = ({ event }) => {
  const { isDarkMode } = useAppStore();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDateRange = () => {
    const start = formatDate(new Date(event.startDate));
    const end = formatDate(new Date(event.endDate));
    
    if (start === end) {
      return start;
    }
    return `${start} — ${end}`;
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'upcoming':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'ongoing':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'ended':
        return isDarkMode ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (event.status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'ended':
        return 'Event ended';
      default:
        return '';
    }
  };

  return (
    <View
      className={cn(
        "mx-4 mb-4 p-6 rounded-3xl shadow-lg",
        isDarkMode ? "bg-gray-800/90" : "bg-white/90"
      )}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{event.icon}</Text>
          <Text
            className={cn(
              "text-xl font-semibold flex-1",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            {event.title}
          </Text>
        </View>
        <View
          className={cn(
            "px-3 py-1 rounded-full",
            event.status === 'ended' 
              ? (isDarkMode ? "bg-red-900/50" : "bg-red-100")
              : (isDarkMode ? "bg-green-900/50" : "bg-green-100")
          )}
        >
          <Text className={cn("text-sm font-medium", getStatusColor())}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Date */}
      <Text
        className={cn(
          "text-base mb-3",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}
      >
        {getDateRange()}
      </Text>

      {/* Description */}
      <Text
        className={cn(
          "text-sm mb-6 leading-5",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}
      >
        {event.description}
      </Text>

      {/* Simple Learn More Button */}
      <Pressable className="flex-row items-center">
        <Text
          className={cn(
            "text-base font-medium",
            isDarkMode ? "text-blue-400" : "text-blue-600"
          )}
        >
          Learn more
        </Text>
      </Pressable>
    </View>
  );
};