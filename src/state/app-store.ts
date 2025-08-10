import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TechEvent {
  id: string;
  title: string;
  icon: string;
  company: Company;
  startDate: Date;
  endDate: Date;
  description: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  confirmationStatus: ConfirmationStatus;
  learnMoreUrl?: string;
}

type TogglePosition = 'bottom-left' | 'top-left';
type SortOption = 'date' | 'name' | 'status';
type Company = 'Apple' | 'Google' | 'Samsung' | 'Valve' | 'Meta';
type EndedEventsFilter = 'hide' | 'recent-only' | 'all';
export type ConfirmationStatus = 'rumor' | 'unofficial' | 'unconfirmed' | 'confirmed' | 'official';

interface AppState {
  isDarkMode: boolean;
  togglePosition: TogglePosition;
  showSettings: boolean;
  sortBy: SortOption;
  selectedCompanies: Company[];
  endedEventsFilter: EndedEventsFilter;
  showBackToTopText: boolean;
  showSortOnMainPage: boolean;
  showFilterOnMainPage: boolean;
  showEndedEventsOnMainPage: boolean;
  showEndedEvents: boolean;
  events: TechEvent[];
  setDarkMode: (isDark: boolean) => void;
  setTogglePosition: (position: TogglePosition) => void;
  setShowSettings: (show: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  toggleCompanyFilter: (company: Company) => void;
  setEndedEventsFilter: (filter: EndedEventsFilter) => void;
  resetFilters: () => void;
  resetToDefaults: () => void;
  setShowBackToTopText: (show: boolean) => void;
  setShowSortOnMainPage: (show: boolean) => void;
  setShowFilterOnMainPage: (show: boolean) => void;
  setShowEndedEventsOnMainPage: (show: boolean) => void;
  setShowEndedEvents: (show: boolean) => void;
  toggleAllMainPageControls: () => void;
  addEvent: (event: TechEvent) => void;
  updateEventStatus: () => void;
}

const mockEvents: TechEvent[] = [
  {
    id: '1',
    title: 'Apple Event (Hardware)',
    icon: '🍎',
    company: 'Apple',
    startDate: new Date(2024, 8, 9), // September 9, 2024
    endDate: new Date(2024, 8, 9), // September 9, 2024
    description: "Apple's iPhone 16 launch event featuring A18 chip, Camera Control, and Apple Intelligence.",
    status: 'ended',
    confirmationStatus: 'official',
    learnMoreUrl: 'https://www.apple.com/apple-events/'
  },
  {
    id: '2',
    title: 'Apple Event (Hardware)',
    icon: '🍎',
    company: 'Apple',
    startDate: new Date(2024, 9, 30), // October 30, 2024
    endDate: new Date(2024, 9, 30), // October 30, 2024
    description: "Apple's iPad mini 7 and MacBook Pro M4 launch event with enhanced AI capabilities.",
    status: 'ended',
    confirmationStatus: 'official'
  },
  {
    id: '3',
    title: 'Samsung Galaxy S25 Unpacked',
    icon: '📱',
    company: 'Samsung',
    startDate: new Date(2025, 0, 22), // January 22, 2025
    endDate: new Date(2025, 0, 22), // January 22, 2025
    description: "Samsung's Galaxy S25 series launch with Snapdragon 8 Elite and enhanced Galaxy AI.",
    status: 'upcoming',
    confirmationStatus: 'official',
    learnMoreUrl: 'https://www.samsung.com/global/galaxy/events/'
  },
  {
    id: '4',
    title: 'Apple Event (Hardware)',
    icon: '🍎',
    company: 'Apple',
    startDate: new Date(2025, 2, 25), // March 25, 2025
    endDate: new Date(2025, 2, 25), // March 25, 2025
    description: "Expected Apple event featuring new iPad Air with M3 chip and updated Apple Pencil.",
    status: 'upcoming',
    confirmationStatus: 'unconfirmed'
  },
  {
    id: '5',
    title: 'Google I/O 2025',
    icon: '🔍',
    company: 'Google',
    startDate: new Date(2025, 4, 14), // May 14, 2025
    endDate: new Date(2025, 4, 16), // May 16, 2025
    description: "Google's developer conference with Android 16, Pixel 9a, and next-gen Gemini AI.",
    status: 'upcoming',
    confirmationStatus: 'confirmed'
  },
  {
    id: '6',
    title: 'Apple Event (Software & Hardware)',
    icon: '🍎',
    company: 'Apple',
    startDate: new Date(2025, 5, 9), // June 9, 2025
    endDate: new Date(2025, 5, 13), // June 13, 2025
    description: "Apple's Worldwide Developers Conference 2025: iOS 19, macOS 16, enhanced Apple Intelligence.",
    status: 'upcoming',
    confirmationStatus: 'confirmed',
    learnMoreUrl: 'https://developer.apple.com/wwdc25/'
  },
  {
    id: '7',
    title: 'Samsung Galaxy Note 25 Event',
    icon: '📱',
    company: 'Samsung',
    startDate: new Date(2025, 7, 12), // August 12, 2025
    endDate: new Date(2025, 7, 12), // August 12, 2025
    description: "Samsung's Galaxy Note 25 series with advanced S Pen AI features and productivity tools.",
    status: 'upcoming',
    confirmationStatus: 'unofficial'
  },
  {
    id: '8',
    title: 'Apple Event (Hardware)',
    icon: '🍎',
    company: 'Apple',
    startDate: new Date(2025, 8, 8), // September 8, 2025
    endDate: new Date(2025, 8, 8), // September 8, 2025
    description: "Apple's iPhone 17 launch event with A19 chip, redesigned camera system, and Air model.",
    status: 'upcoming',
    confirmationStatus: 'unconfirmed'
  },
  {
    id: '9',
    title: 'Meta Connect 2025',
    icon: '🥽',
    company: 'Meta',
    startDate: new Date(2025, 8, 24), // September 24, 2025
    endDate: new Date(2025, 8, 26), // September 26, 2025
    description: "Meta's VR/AR conference with Quest 4, Orion AR glasses, and metaverse platform updates.",
    status: 'upcoming',
    confirmationStatus: 'confirmed'
  },
  {
    id: '10',
    title: 'Steam Deck 2 Announcement',
    icon: '🎮',
    company: 'Valve',
    startDate: new Date(2025, 10, 15), // November 15, 2025
    endDate: new Date(2025, 10, 15), // November 15, 2025
    description: "Valve's next-generation Steam Deck with improved performance, OLED display, and better battery.",
    status: 'upcoming',
    confirmationStatus: 'rumor'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDarkMode: true,
      togglePosition: 'bottom-left',
      showSettings: false,
      sortBy: 'date',
      selectedCompanies: ['Apple', 'Valve', 'Meta'], // Default: Google and Samsung unselected
      endedEventsFilter: 'all',
      showBackToTopText: true,
      showSortOnMainPage: false, // Default: only in settings
      showFilterOnMainPage: false, // Default: only in settings
      showEndedEventsOnMainPage: false, // Default: only in settings
      showEndedEvents: false, // Default: collapsed
      events: mockEvents,
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      setTogglePosition: (position) => set({ togglePosition: position }),
      setShowSettings: (show) => set({ showSettings: show }),
      setSortBy: (sort) => set({ sortBy: sort }),
      toggleCompanyFilter: (company) => set((state) => ({
        selectedCompanies: state.selectedCompanies.includes(company)
          ? state.selectedCompanies.filter(c => c !== company)
          : [...state.selectedCompanies, company]
      })),
      setEndedEventsFilter: (filter) => set({ endedEventsFilter: filter }),
      resetFilters: () => set({ selectedCompanies: ['Apple', 'Google', 'Samsung', 'Valve', 'Meta'] }),
      resetToDefaults: () => set({ 
        sortBy: 'date',
        selectedCompanies: ['Apple', 'Valve', 'Meta'],
        endedEventsFilter: 'all',
        showBackToTopText: true,
        showSortOnMainPage: false,
        showFilterOnMainPage: false,
        showEndedEventsOnMainPage: false,
        showEndedEvents: false,
        togglePosition: 'bottom-left'
      }),
      setShowBackToTopText: (show) => set({ showBackToTopText: show }),
      setShowSortOnMainPage: (show) => set({ showSortOnMainPage: show }),
      setShowFilterOnMainPage: (show) => set({ showFilterOnMainPage: show }),
      setShowEndedEventsOnMainPage: (show) => set({ showEndedEventsOnMainPage: show }),
      setShowEndedEvents: (show) => set({ showEndedEvents: show }),
      toggleAllMainPageControls: () => set((state) => {
        const allEnabled = state.showSortOnMainPage && state.showFilterOnMainPage && state.showEndedEventsOnMainPage;
        return {
          showSortOnMainPage: !allEnabled,
          showFilterOnMainPage: !allEnabled,
          showEndedEventsOnMainPage: !allEnabled
        };
      }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEventStatus: () => set((state) => ({
        events: state.events.map(event => {
          const now = new Date();
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          
          if (now < start) {
            return { ...event, status: 'upcoming' as const };
          } else if (now >= start && now <= end) {
            return { ...event, status: 'ongoing' as const };
          } else {
            return { ...event, status: 'ended' as const };
          }
        })
      }))
    }),
    {
      name: 'tech-events-app',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        togglePosition: state.togglePosition,
        sortBy: state.sortBy,
        selectedCompanies: state.selectedCompanies,
        endedEventsFilter: state.endedEventsFilter,
        showBackToTopText: state.showBackToTopText,
        showSortOnMainPage: state.showSortOnMainPage,
        showFilterOnMainPage: state.showFilterOnMainPage,
        showEndedEventsOnMainPage: state.showEndedEventsOnMainPage,
        showEndedEvents: state.showEndedEvents
      })
    }
  )
);