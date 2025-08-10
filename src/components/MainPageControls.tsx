import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../state/app-store';

export const MainPageControls: React.FC = () => {
  const { 
    isDarkMode, 
    sortBy, 
    selectedCompanies,
    endedEventsFilter,
    showSortOnMainPage,
    showFilterOnMainPage,
    showEndedEventsOnMainPage,
    setSortBy, 
    toggleCompanyFilter,
    setEndedEventsFilter
  } = useAppStore();

  const companies: Array<{name: 'Apple' | 'Google' | 'Samsung' | 'Valve' | 'Meta', icon: string}> = [
    { name: 'Apple', icon: '🍎' },
    { name: 'Google', icon: '🔍' },
    { name: 'Samsung', icon: '📱' },
    { name: 'Valve', icon: '🎮' },
    { name: 'Meta', icon: '🥽' },
  ];

  const sortOptions: Array<{value: 'date' | 'name' | 'status', label: string, icon: string}> = [
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'name', label: 'Name', icon: '🔤' },
    { value: 'status', label: 'Status', icon: '🏷️' },
  ];

  const endedEventsOptions = [
    { value: 'all' as const, label: 'All Events', icon: '📋' },
    { value: 'recent-only' as const, label: 'Recent Only', icon: '⏰' },
    { value: 'hide' as const, label: 'Hide Ended', icon: '👁️' },
  ];

  if (!showSortOnMainPage && !showFilterOnMainPage && !showEndedEventsOnMainPage) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
      {/* Sort Controls */}
      {showSortOnMainPage && (
        <View style={{ marginBottom: showFilterOnMainPage ? 16 : 0 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: isDarkMode ? '#e5e7eb' : '#374151',
              marginBottom: 8
            }}
          >
            Sort by
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {sortOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSortBy(option.value)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: sortBy === option.value 
                      ? '#22c55e' 
                      : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                    backgroundColor: sortBy === option.value
                      ? (isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)')
                      : (isDarkMode ? '#374151' : '#f9fafb')
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{option.icon}</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: sortBy === option.value ? '500' : '400',
                      color: sortBy === option.value 
                        ? '#22c55e' 
                        : (isDarkMode ? '#e5e7eb' : '#374151')
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Ended Events Filter */}
      {showEndedEventsOnMainPage && (
        <View style={{ marginBottom: showFilterOnMainPage ? 16 : 0 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: isDarkMode ? '#e5e7eb' : '#374151',
              marginBottom: 8
            }}
          >
            Show ended events
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {endedEventsOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setEndedEventsFilter(option.value)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: endedEventsFilter === option.value 
                      ? '#f59e0b' 
                      : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                    backgroundColor: endedEventsFilter === option.value
                      ? (isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)')
                      : (isDarkMode ? '#374151' : '#f9fafb')
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{option.icon}</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: endedEventsFilter === option.value ? '500' : '400',
                      color: endedEventsFilter === option.value 
                        ? '#f59e0b' 
                        : (isDarkMode ? '#e5e7eb' : '#374151')
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Filter Controls */}
      {showFilterOnMainPage && (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: isDarkMode ? '#e5e7eb' : '#374151',
              marginBottom: 8
            }}
          >
            Companies
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {companies.map((company) => (
                <Pressable
                  key={company.name}
                  onPress={() => toggleCompanyFilter(company.name)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: selectedCompanies.includes(company.name) 
                      ? '#8b5cf6' 
                      : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                    backgroundColor: selectedCompanies.includes(company.name)
                      ? (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)')
                      : (isDarkMode ? '#374151' : '#f9fafb')
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
          </ScrollView>
        </View>
      )}
    </View>
  );
};