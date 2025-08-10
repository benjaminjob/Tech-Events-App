import React from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../state/app-store';

export const NewSettingsModal: React.FC = () => {
  const { 
    isDarkMode, 
    showSettings, 
    togglePosition, 
    sortBy,
    selectedCompanies,
    endedEventsFilter,
    showBackToTopText,
    showSortOnMainPage,
    showFilterOnMainPage,
    showEndedEventsOnMainPage,
    setShowSettings, 
    setTogglePosition,
    setSortBy,
    toggleCompanyFilter,
    setEndedEventsFilter,
    resetFilters,
    resetToDefaults,
    setShowBackToTopText,
    setShowSortOnMainPage,
    setShowFilterOnMainPage,
    setShowEndedEventsOnMainPage,
    toggleAllMainPageControls
  } = useAppStore();

  const companies: Array<{name: 'Apple' | 'Google' | 'Samsung' | 'Valve' | 'Meta', icon: string}> = [
    { name: 'Apple', icon: '🍎' },
    { name: 'Google', icon: '🔍' },
    { name: 'Samsung', icon: '📱' },
    { name: 'Valve', icon: '🎮' },
    { name: 'Meta', icon: '🥽' },
  ];

  const sortOptions: Array<{value: 'date' | 'name' | 'status', label: string, icon: string}> = [
    { value: 'date', label: 'By Date', icon: 'calendar-outline' },
    { value: 'name', label: 'By Name', icon: 'text-outline' },
    { value: 'status', label: 'By Status', icon: 'flag-outline' },
  ];

  return (
    <Modal
      visible={showSettings}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        justifyContent: 'flex-end' 
      }}>
        <View
          style={{
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            maxHeight: '85%',
          }}
        >
          {/* Handle Bar */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: isDarkMode ? '#6b7280' : '#d1d5db',
              borderRadius: 2
            }} />
          </View>

          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            marginBottom: 24
          }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: isDarkMode ? '#ffffff' : '#111827'
              }}
            >
              Settings
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={resetToDefaults}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: '#ffffff'
                  }}
                >
                  Reset to Defaults
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowSettings(false)}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={isDarkMode ? "#d1d5db" : "#374151"}
                />
              </Pressable>
            </View>
          </View>

          <ScrollView style={{ paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
            {/* Toggle Position Setting */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 16,
                  color: isDarkMode ? '#e5e7eb' : '#374151'
                }}
              >
                Dark Mode Toggle Position
              </Text>

              <View style={{ gap: 12 }}>
                {/* Bottom Left Option */}
                <Pressable
                  onPress={() => setTogglePosition('bottom-left')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: togglePosition === 'bottom-left' 
                      ? '#3b82f6' 
                      : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                    backgroundColor: togglePosition === 'bottom-left'
                      ? (isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                      : (isDarkMode ? '#374151' : '#f9fafb')
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: togglePosition === 'bottom-left' ? '#3b82f6' : '#9ca3af',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12
                    }}
                  >
                    {togglePosition === 'bottom-left' && (
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#3b82f6'
                      }} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: isDarkMode ? '#ffffff' : '#111827',
                        marginBottom: 2
                      }}
                    >
                      Bottom Left
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      Default position at the bottom left corner
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                </Pressable>

                {/* Top Left Option */}
                <Pressable
                  onPress={() => setTogglePosition('top-left')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: togglePosition === 'top-left' 
                      ? '#3b82f6' 
                      : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                    backgroundColor: togglePosition === 'top-left'
                      ? (isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                      : (isDarkMode ? '#374151' : '#f9fafb')
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: togglePosition === 'top-left' ? '#3b82f6' : '#9ca3af',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12
                    }}
                  >
                    {togglePosition === 'top-left' && (
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#3b82f6'
                      }} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: isDarkMode ? '#ffffff' : '#111827',
                        marginBottom: 2
                      }}
                    >
                      Top Left
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      Alternative position at the top left corner
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-up"
                    size={20}
                    color={isDarkMode ? "#9ca3af" : "#6b7280"}
                  />
                </Pressable>
              </View>
            </View>

            {/* Sort Options */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 16,
                  color: isDarkMode ? '#e5e7eb' : '#374151'
                }}
              >
                Sort Events
              </Text>

              <View style={{ gap: 8 }}>
                {sortOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => setSortBy(option.value)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 12,
                      backgroundColor: sortBy === option.value
                        ? (isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)')
                        : 'transparent'
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={sortBy === option.value ? '#22c55e' : (isDarkMode ? '#9ca3af' : '#6b7280')}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: sortBy === option.value ? '500' : '400',
                        color: sortBy === option.value ? '#22c55e' : (isDarkMode ? '#e5e7eb' : '#374151'),
                        flex: 1
                      }}
                    >
                      {option.label}
                    </Text>
                    {sortBy === option.value && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color="#22c55e"
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Ended Events Filter */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 16,
                  color: isDarkMode ? '#e5e7eb' : '#374151'
                }}
              >
                Show Ended Events
              </Text>

              <View style={{ gap: 8 }}>
                <Pressable
                  onPress={() => setEndedEventsFilter('all')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: endedEventsFilter === 'all'
                      ? (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)')
                      : 'transparent'
                  }}
                >
                  <Ionicons
                    name="list-outline"
                    size={20}
                    color={endedEventsFilter === 'all' ? '#8b5cf6' : (isDarkMode ? '#9ca3af' : '#6b7280')}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: endedEventsFilter === 'all' ? '500' : '400',
                        color: endedEventsFilter === 'all' ? '#8b5cf6' : (isDarkMode ? '#e5e7eb' : '#374151')
                      }}
                    >
                      Show All Events
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      Include all events regardless of status
                    </Text>
                  </View>
                  {endedEventsFilter === 'all' && (
                    <Ionicons name="checkmark" size={20} color="#8b5cf6" />
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setEndedEventsFilter('recent-only')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: endedEventsFilter === 'recent-only'
                      ? (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)')
                      : 'transparent'
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={endedEventsFilter === 'recent-only' ? '#8b5cf6' : (isDarkMode ? '#9ca3af' : '#6b7280')}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: endedEventsFilter === 'recent-only' ? '500' : '400',
                        color: endedEventsFilter === 'recent-only' ? '#8b5cf6' : (isDarkMode ? '#e5e7eb' : '#374151')
                      }}
                    >
                      Recently Ended Only
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      Show events ended within the last 30 days
                    </Text>
                  </View>
                  {endedEventsFilter === 'recent-only' && (
                    <Ionicons name="checkmark" size={20} color="#8b5cf6" />
                  )}
                </Pressable>

                <Pressable
                  onPress={() => setEndedEventsFilter('hide')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: endedEventsFilter === 'hide'
                      ? (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)')
                      : 'transparent'
                  }}
                >
                  <Ionicons
                    name="eye-off-outline"
                    size={20}
                    color={endedEventsFilter === 'hide' ? '#8b5cf6' : (isDarkMode ? '#9ca3af' : '#6b7280')}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: endedEventsFilter === 'hide' ? '500' : '400',
                        color: endedEventsFilter === 'hide' ? '#8b5cf6' : (isDarkMode ? '#e5e7eb' : '#374151')
                      }}
                    >
                      Hide Ended Events
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      Only show upcoming and ongoing events
                    </Text>
                  </View>
                  {endedEventsFilter === 'hide' && (
                    <Ionicons name="checkmark" size={20} color="#8b5cf6" />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Back to Top Button */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 16,
                  color: isDarkMode ? '#e5e7eb' : '#374151'
                }}
              >
                Back to Top Button
              </Text>

              {/* Back to Top Text Toggle */}
              <Pressable
                onPress={() => setShowBackToTopText(!showBackToTopText)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="text-outline"
                    size={20}
                    color={isDarkMode ? '#9ca3af' : '#6b7280'}
                    style={{ marginRight: 12 }}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: isDarkMode ? '#ffffff' : '#111827'
                      }}
                    >
                      Show "Top" text in button
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      Display text label next to the up arrow
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 50,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: showBackToTopText ? '#22c55e' : (isDarkMode ? '#4b5563' : '#d1d5db'),
                    justifyContent: 'center',
                    paddingHorizontal: 2
                  }}
                >
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: '#ffffff',
                      alignSelf: showBackToTopText ? 'flex-end' : 'flex-start'
                    }}
                  />
                </View>
              </Pressable>
            </View>

            {/* Main Page Controls */}
            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: isDarkMode ? '#e5e7eb' : '#374151'
                  }}
                >
                  Main Page Controls
                </Text>
                <Pressable
                  onPress={toggleAllMainPageControls}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: isDarkMode ? '#d1d5db' : '#374151'
                    }}
                  >
                    {(showSortOnMainPage && showFilterOnMainPage && showEndedEventsOnMainPage) 
                      ? 'Disable All' 
                      : 'Enable All'
                    }
                  </Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                {/* Sort on Main Page Toggle */}
                <Pressable
                  onPress={() => setShowSortOnMainPage(!showSortOnMainPage)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="funnel-outline"
                      size={20}
                      color={isDarkMode ? '#9ca3af' : '#6b7280'}
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: isDarkMode ? '#ffffff' : '#111827'
                        }}
                      >
                        Show sort options on main page
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: isDarkMode ? '#9ca3af' : '#6b7280'
                        }}
                      >
                        Quick access to sort controls
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 50,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: showSortOnMainPage ? '#22c55e' : (isDarkMode ? '#4b5563' : '#d1d5db'),
                      justifyContent: 'center',
                      paddingHorizontal: 2
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: '#ffffff',
                        alignSelf: showSortOnMainPage ? 'flex-end' : 'flex-start'
                      }}
                    />
                  </View>
                </Pressable>

                {/* Filter on Main Page Toggle */}
                <Pressable
                  onPress={() => setShowFilterOnMainPage(!showFilterOnMainPage)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="options-outline"
                      size={20}
                      color={isDarkMode ? '#9ca3af' : '#6b7280'}
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: isDarkMode ? '#ffffff' : '#111827'
                        }}
                      >
                        Show company filters on main page
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: isDarkMode ? '#9ca3af' : '#6b7280'
                        }}
                      >
                        Quick access to company filters
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 50,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: showFilterOnMainPage ? '#22c55e' : (isDarkMode ? '#4b5563' : '#d1d5db'),
                      justifyContent: 'center',
                      paddingHorizontal: 2
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: '#ffffff',
                        alignSelf: showFilterOnMainPage ? 'flex-end' : 'flex-start'
                      }}
                    />
                  </View>
                </Pressable>

                {/* Ended Events on Main Page Toggle */}
                <Pressable
                  onPress={() => setShowEndedEventsOnMainPage(!showEndedEventsOnMainPage)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? '#374151' : '#f9fafb'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={isDarkMode ? '#9ca3af' : '#6b7280'}
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: isDarkMode ? '#ffffff' : '#111827'
                        }}
                      >
                        Show ended events filter on main page
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: isDarkMode ? '#9ca3af' : '#6b7280'
                        }}
                      >
                        Quick access to ended events options
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: 50,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: showEndedEventsOnMainPage ? '#22c55e' : (isDarkMode ? '#4b5563' : '#d1d5db'),
                      justifyContent: 'center',
                      paddingHorizontal: 2
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: '#ffffff',
                        alignSelf: showEndedEventsOnMainPage ? 'flex-end' : 'flex-start'
                      }}
                    />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Company Filters */}
            <View style={{ marginBottom: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: isDarkMode ? '#e5e7eb' : '#374151'
                  }}
                >
                  Filter by Company
                </Text>
                <Pressable
                  onPress={() => {
                    if (selectedCompanies.length === companies.length) {
                      // If all are selected, deselect all
                      companies.forEach(company => {
                        if (selectedCompanies.includes(company.name)) {
                          toggleCompanyFilter(company.name);
                        }
                      });
                    } else {
                      // If not all selected, select all
                      resetFilters();
                    }
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: isDarkMode ? '#d1d5db' : '#374151'
                    }}
                  >
                    {selectedCompanies.length === companies.length ? 'Deselect All' : 'Select All'}
                  </Text>
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {companies.map((company) => (
                  <Pressable
                    key={company.name}
                    onPress={() => toggleCompanyFilter(company.name)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: selectedCompanies.includes(company.name) 
                        ? '#8b5cf6' 
                        : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                      backgroundColor: selectedCompanies.includes(company.name)
                        ? (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)')
                        : 'transparent'
                    }}
                  >
                    <Text style={{ fontSize: 16, marginRight: 6 }}>{company.icon}</Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: selectedCompanies.includes(company.name) ? '500' : '400',
                        color: selectedCompanies.includes(company.name) 
                          ? '#8b5cf6' 
                          : (isDarkMode ? '#e5e7eb' : '#374151')
                      }}
                    >
                      {company.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Footer Note */}
            <View style={{ 
              padding: 16, 
              borderRadius: 12, 
              backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
              marginBottom: 32
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={isDarkMode ? "#9ca3af" : "#6b7280"}
                  style={{ marginTop: 2, marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    lineHeight: 20,
                    flex: 1
                  }}
                >
                  You can also drag the toggle between positions. Events are filtered and sorted in real-time.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};