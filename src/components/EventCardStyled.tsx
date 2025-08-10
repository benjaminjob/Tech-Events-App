import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Linking, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TechEvent } from '../state/app-store';
import { useAppStore } from '../state/app-store';

interface EventCardProps {
  event: TechEvent;
}

export const EventCardStyled: React.FC<EventCardProps> = ({ event }) => {
  const { isDarkMode } = useAppStore();
  const [timeLeft, setTimeLeft] = useState<string>('');

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

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event]);

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

  const handleLearnMore = () => {
    if (event.learnMoreUrl) {
      Linking.openURL(event.learnMoreUrl);
    }
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

  const getStatusColors = () => {
    switch (event.status) {
      case 'upcoming':
        return {
          text: isDarkMode ? '#10b981' : '#059669',
          bg: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'
        };
      case 'ongoing':
        return {
          text: isDarkMode ? '#3b82f6' : '#2563eb',
          bg: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'
        };
      case 'ended':
        return {
          text: isDarkMode ? '#ef4444' : '#dc2626',
          bg: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'
        };
      default:
        return {
          text: isDarkMode ? '#6b7280' : '#4b5563',
          bg: isDarkMode ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'
        };
    }
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

  const statusColors = getStatusColors();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{event.icon}</Text>
          <Text style={[
            styles.title,
            { color: isDarkMode ? 'white' : '#111827' }
          ]}>
            {event.title}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Date */}
      <Text style={[
        styles.dateText,
        { color: isDarkMode ? '#d1d5db' : '#4b5563' }
      ]}>
        {getDateRange()}
      </Text>

      {/* Description */}
      <Text style={[
        styles.description,
        { color: isDarkMode ? '#9ca3af' : '#6b7280' }
      ]}>
        {event.description}
      </Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable onPress={handleLearnMore} style={styles.learnMoreButton}>
          <Text style={[
            styles.learnMoreText,
            { color: isDarkMode ? '#60a5fa' : '#2563eb' }
          ]}>
            Learn more
          </Text>
          <Ionicons
            name="open-outline"
            size={16}
            color={isDarkMode ? "#60a5fa" : "#2563eb"}
            style={{ marginLeft: 8 }}
          />
        </Pressable>

        <Pressable
          onPress={handleAddToCalendar}
          style={[
            styles.calendarButton,
            { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={isDarkMode ? "#d1d5db" : "#374151"}
            style={{ marginRight: 8 }}
          />
          <Text style={[
            styles.calendarText,
            { color: isDarkMode ? '#d1d5db' : '#374151' }
          ]}>
            Add to Calendar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  calendarText: {
    fontSize: 14,
    fontWeight: '500',
  },
});