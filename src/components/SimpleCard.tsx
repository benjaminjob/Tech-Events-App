import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TechEvent } from '../state/app-store';
import { useAppStore } from '../state/app-store';

interface SimpleCardProps {
  event: TechEvent;
}

export const SimpleCard: React.FC<SimpleCardProps> = ({ event }) => {
  const { isDarkMode } = useAppStore();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [showExactTime, setShowExactTime] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const eventDate = event.status === 'upcoming' ? new Date(event.startDate) : new Date(event.endDate);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        if (event.status === 'upcoming') {
          setTimeLeft('Event started!');
        } else {
          setTimeLeft('');
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (showExactTime) {
        // Exact countdown
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } else {
        // Rough countdown
        if (days >= 365) {
          const years = Math.floor(days / 365);
          setTimeLeft(`about ${years} year${years === 1 ? '' : 's'}`);
        } else if (days >= 30) {
          const months = Math.floor(days / 30);
          setTimeLeft(`about ${months} month${months === 1 ? '' : 's'}`);
        } else if (days >= 7) {
          const weeks = Math.floor(days / 7);
          setTimeLeft(`about ${weeks} week${weeks === 1 ? '' : 's'}`);
        } else if (days > 0) {
          setTimeLeft(`about ${days} day${days === 1 ? '' : 's'}`);
        } else if (hours > 0) {
          setTimeLeft(`about ${hours} hour${hours === 1 ? '' : 's'}`);
        } else {
          setTimeLeft(`about ${minutes} minute${minutes === 1 ? '' : 's'}`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [event, showExactTime]);

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

  const handleAddToCalendar = () => {
    const startDate = new Date(event.startDate).toLocaleDateString();
    const endDate = new Date(event.endDate).toLocaleDateString();
    const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
    
    Alert.alert(
      'Event Details',
      `${event.title}\n\n${dateRange}\n\n${event.description}\n\nYou can manually add this to your calendar.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getStatusText = () => {
    switch (event.status) {
      case 'upcoming':
        return timeLeft || 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'ended':
        return 'Event ended';
      default:
        return '';
    }
  };

  const toggleCountdownFormat = () => {
    setShowExactTime(!showExactTime);
  };

  const getConfirmationStatus = () => {
    const statusMap = {
      official: { text: 'Official', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' },
      confirmed: { text: 'Confirmed', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
      unconfirmed: { text: 'Unconfirmed', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
      unofficial: { text: 'Unofficial', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
      rumor: { text: 'Rumor', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
    };
    return statusMap[event.confirmationStatus] || statusMap.unconfirmed;
  };

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 24,
        borderRadius: 24,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{event.icon}</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: isDarkMode ? '#ffffff' : '#111827',
              flex: 1
            }}
          >
            {event.title}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Confirmation Status Badge */}
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: getConfirmationStatus().bgColor
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '500',
                color: getConfirmationStatus().color
              }}
            >
              {getConfirmationStatus().text}
            </Text>
          </View>
          {/* Event Status Badge */}
          <Pressable
            onPress={event.status === 'upcoming' && timeLeft && !timeLeft.includes('started') ? toggleCountdownFormat : undefined}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
              backgroundColor: event.status === 'ended' 
                ? (isDarkMode ? 'rgba(127, 29, 29, 0.5)' : '#fecaca')
                : (isDarkMode ? 'rgba(20, 83, 45, 0.5)' : '#dcfce7'),
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: event.status === 'ended'
                  ? (isDarkMode ? '#f87171' : '#dc2626')
                  : (isDarkMode ? '#4ade80' : '#16a34a'),
              }}
            >
              {getStatusText()}
            </Text>
            {(event.status === 'upcoming' && timeLeft && !timeLeft.includes('started')) && (
              <Ionicons
                name="time-outline"
                size={10}
                color={event.status === 'ended'
                  ? (isDarkMode ? '#f87171' : '#dc2626')
                  : (isDarkMode ? '#4ade80' : '#16a34a')
                }
                style={{ marginLeft: 4 }}
              />
            )}
          </Pressable>
        </View>
      </View>

      {/* Date */}
      <Text
        style={{
          fontSize: 16,
          marginBottom: 12,
          color: isDarkMode ? '#d1d5db' : '#4b5563'
        }}
      >
        {getDateRange()}
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          marginBottom: 24,
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        }}
      >
        {event.description}
      </Text>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              marginRight: 8,
              color: isDarkMode ? '#60a5fa' : '#2563eb'
            }}
          >
            Learn more
          </Text>
          <Ionicons
            name="open-outline"
            size={16}
            color={isDarkMode ? "#60a5fa" : "#2563eb"}
          />
        </Pressable>

        <Pressable
          onPress={handleAddToCalendar}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={isDarkMode ? "#d1d5db" : "#374151"}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: isDarkMode ? '#e5e7eb' : '#374151'
            }}
          >
            Add to Calendar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};