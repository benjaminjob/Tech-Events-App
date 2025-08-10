import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, useWindowDimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useAppStore } from '../state/app-store';
import type { ConfirmationStatus } from '../state/app-store';
import { SimpleCard } from '../components/SimpleCard';
import { WorkingDarkModeToggle } from '../components/WorkingDarkModeToggle';
import { NewSettingsModal } from '../components/NewSettingsModal';
import { MainPageControls } from '../components/MainPageControls';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TechEventsScreen: React.FC = () => {
  const { 
    isDarkMode, 
    events, 
    sortBy, 
    selectedCompanies,
    endedEventsFilter,
    showBackToTopText,
    showSortOnMainPage,
    showFilterOnMainPage,
    showEndedEvents,
    updateEventStatus, 
    setShowSettings,
    setShowEndedEvents
  } = useAppStore();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollY = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    updateEventStatus();
    const interval = setInterval(updateEventStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateEventStatus]);

  // Filter and sort events
  const { activeEvents, endedEventsToShow, totalEndedEvents } = React.useMemo(() => {
    // Filter by selected companies
    let filtered = events.filter(event => selectedCompanies.includes(event.company));

    // Separate ended and active events
    const active = filtered.filter(event => event.status !== 'ended');
    const ended = filtered.filter(event => event.status === 'ended');

    // Filter ended events by preference
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    let filteredEnded = ended;
    if (endedEventsFilter === 'hide') {
      filteredEnded = [];
    } else if (endedEventsFilter === 'recent-only') {
      filteredEnded = ended.filter(event => {
        const endDate = new Date(event.endDate);
        return endDate >= thirtyDaysAgo;
      });
    }

    // Sort ended events by end date (most recent first)
    filteredEnded.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

    // Sort active events
    let sortedActive = [...active];
    switch (sortBy) {
      case 'name':
        sortedActive.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'status':
        // Sort by confirmation status with rumors at bottom
        const confirmationOrder: Record<ConfirmationStatus, number> = { 
          official: 0, 
          confirmed: 1, 
          unconfirmed: 2, 
          unofficial: 3, 
          rumor: 4 
        };
        const eventStatusOrder: Record<'ongoing' | 'upcoming', number> = { ongoing: 0, upcoming: 1 };
        
        sortedActive.sort((a, b) => {
          // First sort by event status (ongoing before upcoming)
          const eventStatusA = eventStatusOrder[a.status as 'ongoing' | 'upcoming'] ?? 2;
          const eventStatusB = eventStatusOrder[b.status as 'ongoing' | 'upcoming'] ?? 2;
          
          if (eventStatusA !== eventStatusB) {
            return eventStatusA - eventStatusB;
          }
          
          // Then sort by confirmation status (rumors at bottom)
          const confirmationA = confirmationOrder[a.confirmationStatus];
          const confirmationB = confirmationOrder[b.confirmationStatus];
          return confirmationA - confirmationB;
        });
        break;
      case 'date':
      default:
        // Sort by date: ongoing first, then upcoming by start date
        sortedActive.sort((a, b) => {
          if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
          if (b.status === 'ongoing' && a.status !== 'ongoing') return 1;
          
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA.getTime() - dateB.getTime(); // Earliest upcoming events first
        });
        break;
    }

    return { 
      activeEvents: sortedActive, 
      endedEventsToShow: showEndedEvents ? filteredEnded : [], 
      totalEndedEvents: filteredEnded.length 
    };
  }, [events, sortBy, selectedCompanies, endedEventsFilter, showEndedEvents]);

  // Handle scroll events
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.value = offsetY;
    const shouldShow = offsetY > 200;
    
    if (shouldShow && !showBackToTop) {
      // Trigger pulse animation when button first appears
      pulseScale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 8 })
      );
    }
    
    setShowBackToTop(shouldShow);
  };

  // Back to top function
  const scrollToTop = () => {
    // Add a small bounce animation when pressed
    pulseScale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Animated style for back to top button
  const backToTopAnimatedStyle = useAnimatedStyle(() => {
    const baseScale = interpolate(
      scrollY.value,
      [150, 200],
      [0, 1],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [150, 200],
      [0, 1],
      Extrapolate.CLAMP
    );

    const finalScale = baseScale * pulseScale.value;

    return {
      transform: [{ scale: withSpring(finalScale, { damping: 15 }) }],
      opacity: withSpring(opacity, { damping: 15 }),
    };
  });

  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDarkMode
            ? ['#1e293b', '#334155', '#475569']
            : ['#e0e7ff', '#c7d2fe', '#a5b4fc']
        }
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ paddingTop: insets.top + 20 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
            <View
              style={{
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
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 32, marginRight: 12 }}>🚀</Text>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: 'bold',
                      color: isDarkMode ? '#ffffff' : '#111827'
                    }}
                  >
                    Major Tech Events
                  </Text>
                </View>
                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {/* Sort Indicator */}
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#22c55e',
                        fontWeight: '500'
                      }}
                    >
                      {sortBy === 'date' ? '📅' : sortBy === 'name' ? '🔤' : '🏷️'}
                    </Text>
                  </View>
                  
                  {/* Settings Button */}
                  <Pressable
                    onPress={() => setShowSettings(true)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
                    }}
                  >
                    <Ionicons
                      name="settings-outline"
                      size={20}
                      color={isDarkMode ? "#d1d5db" : "#374151"}
                    />
                  </Pressable>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  marginBottom: 8,
                  color: isDarkMode ? '#4ade80' : '#16a34a'
                }}
              >
                & Countdowns
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 8,
                  color: isDarkMode ? '#d1d5db' : '#4b5563'
                }}
              >
                Upcoming Apple, Valve, Samsung, and Google launches—all in one place.
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: isDarkMode ? '#d1d5db' : '#4b5563'
                }}
              >
                Never miss the headlines again.
              </Text>
            </View>
          </View>

          {/* Main Page Controls */}
          <MainPageControls />

          {/* Filter/Sort Info */}
          {(selectedCompanies.length < 5 || sortBy !== 'date' || endedEventsFilter !== 'all') && (
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <View
                style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  borderWidth: 1,
                  borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: isDarkMode ? '#93c5fd' : '#3b82f6',
                    textAlign: 'center'
                  }}
                >
                  {selectedCompanies.length < 5 && `Showing ${selectedCompanies.join(', ')} events`}
                  {selectedCompanies.length < 5 && (sortBy !== 'date' || endedEventsFilter !== 'all') && ' • '}
                  {sortBy !== 'date' && `Sorted by ${sortBy}`}
                  {sortBy !== 'date' && endedEventsFilter !== 'all' && ' • '}
                  {endedEventsFilter === 'hide' && 'Ended events hidden'}
                  {endedEventsFilter === 'recent-only' && 'Recent ended events only'}
                </Text>
              </View>
            </View>
          )}

          {/* Active Events */}
          {activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <SimpleCard key={event.id} event={event} />
            ))
          ) : endedEventsToShow.length === 0 && totalEndedEvents === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text style={{ fontSize: 64, marginBottom: 16 }}>📭</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: isDarkMode ? '#e5e7eb' : '#374151',
                  marginBottom: 8,
                  textAlign: 'center'
                }}
              >
                No events found
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  textAlign: 'center'
                }}
              >
                Try adjusting your filters
              </Text>
            </View>
          ) : null}

          {/* Show/Hide Ended Events Button */}
          {totalEndedEvents > 0 && endedEventsFilter !== 'hide' && (
            <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <Pressable
                onPress={() => setShowEndedEvents(!showEndedEvents)}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: showEndedEvents 
                    ? (isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')
                    : (isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.1)'),
                  borderWidth: 2,
                  borderColor: showEndedEvents
                    ? (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')
                    : (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.2)'),
                  borderStyle: showEndedEvents ? 'solid' : 'dashed',
                  alignItems: 'center'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons
                    name={showEndedEvents ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={showEndedEvents ? (isDarkMode ? "#f87171" : "#dc2626") : (isDarkMode ? "#9ca3af" : "#6b7280")}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: showEndedEvents ? (isDarkMode ? '#f87171' : '#dc2626') : (isDarkMode ? '#d1d5db' : '#374151')
                    }}
                  >
                    {showEndedEvents ? 'Hide' : 'Show'} {totalEndedEvents} ended event{totalEndedEvents === 1 ? '' : 's'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: showEndedEvents ? (isDarkMode ? '#fca5a5' : '#f87171') : (isDarkMode ? '#9ca3af' : '#6b7280')
                  }}
                >
                  {showEndedEvents 
                    ? 'Tap to hide recently concluded events' 
                    : 'Tap to view recently concluded events'
                  }
                </Text>
              </Pressable>
            </View>
          )}

          {/* Ended Events */}
          {endedEventsToShow.map((event) => (
            <SimpleCard key={event.id} event={event} />
          ))}

          {/* Data Source Attribution */}
          <View style={{ 
            marginTop: 32,
            marginHorizontal: 16,
            marginBottom: 16,
            padding: 16,
            borderRadius: 12,
            backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.1)',
            borderWidth: 1,
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.2)'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={isDarkMode ? "#9ca3af" : "#6b7280"}
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    lineHeight: 16,
                    marginBottom: 4
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>Data Sources:</Text> Historical events are based on actual tech conferences. Future events are projected based on typical company schedules and industry patterns. Dates and details are subject to change.
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: isDarkMode ? '#6b7280' : '#9ca3af',
                    fontStyle: 'italic'
                  }}
                >
                  Last updated: January 2025 • Visit official company websites for confirmed dates
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>

        {/* Back to Top Button */}
        <AnimatedPressable
          onPress={scrollToTop}
          style={[
            backToTopAnimatedStyle,
            {
              position: 'absolute',
              bottom: insets.bottom + 10, // Even lower position
              alignSelf: 'center',
              zIndex: 999,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 25, // Squashed oval shape
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="chevron-up"
              size={20}
              color={isDarkMode ? '#d1d5db' : '#374151'}
              style={{ marginRight: showBackToTopText ? 6 : 0 }}
            />
            {showBackToTopText && (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isDarkMode ? '#d1d5db' : '#374151',
                }}
              >
                Top
              </Text>
            )}
          </View>
        </AnimatedPressable>

        {/* Draggable Dark Mode Toggle */}
        <WorkingDarkModeToggle
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />

        {/* Settings Modal */}
        <NewSettingsModal />
      </LinearGradient>
    </View>
  );
};