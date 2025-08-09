import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Navbar from './Components/Navbar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../Context/ThemeContext';
import HeadingText from './Components/HeadingText';
import { heightPercentageToDP } from 'react-native-responsive-screen';

// Configure calendar locale
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

const { width, height } = Dimensions.get('window');

// Function to get current date in IST
const getCurrentDateInIST = () => {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 330 * 60 * 1000; // 5.5 hours in milliseconds
  const istTime = now.getTime() + istOffset;
  const istDate = new Date(istTime);
  
  // Format as YYYY-MM-DD
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const CalendarPage = ({ isCalendarRoute = true }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [selectedDate, setSelectedDate] = useState(getCurrentDateInIST());
  const [showDateDetails, setShowDateDetails] = useState(false);
  const [todayIST, setTodayIST] = useState(getCurrentDateInIST());
  
  // Update todayIST periodically to handle date changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayIST(getCurrentDateInIST());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Define holiday events with date ranges and symbols
  const holidayEvents = useMemo(() => [
    { name: "New Year's Day", start: '2025-01-01', end: '2025-01-01' },
    { name: "Republic Day", start: '2025-01-26', end: '2025-01-26' },
    { name: "Basant Panchami", start: '2025-02-03', end: '2025-02-03' },
    { name: "Mahashivaratri", start: '2025-02-26', end: '2025-02-26' },
    { name: "Holi", start: '2025-03-13', end: '2025-03-15' },
    { name: "Id-ul-Fitr*", start: '2025-03-31', end: '2025-03-31', symbol: '*' },
    { name: "Sarhul", start: '2025-04-01', end: '2025-04-01' },
    { name: "Shree Ram Navami", start: '2025-04-06', end: '2025-04-06' },
    { name: "Mahavir Jayanti", start: '2025-04-10', end: '2025-04-10' },
    { name: "Ambedkar Jayanti", start: '2025-04-14', end: '2025-04-14' },
    { name: "Good Friday", start: '2025-04-18', end: '2025-04-18' },
    { name: "Annual Summer Vacation", start: '2025-05-12', end: '2025-06-06' },
    { name: "Id-ul-zuha (Bakrid)*", start: '2025-06-07', end: '2025-06-07', symbol: '*' },
    { name: "Rath Yatra", start: '2025-06-27', end: '2025-06-27' },
    { name: "Muharram*", start: '2025-07-06', end: '2025-07-06', symbol: '*' },
    { name: "Independence Day", start: '2025-08-15', end: '2025-08-15' },
    { name: "Shree Krishna Janmashtami", start: '2025-08-16', end: '2025-08-16' },
    { name: "Karma", start: '2025-09-03', end: '2025-09-03' },
    { name: "Milad-un-Nabi*", start: '2025-09-05', end: '2025-09-05', symbol: '*' },
    { name: "Puja Holidays", start: '2025-09-27', end: '2025-10-04' },
    { name: "Mahatma Gandhi Jayanti", start: '2025-10-02', end: '2025-10-02' },
    { name: "Diwali", start: '2025-10-18', end: '2025-10-21' },
    { name: "Dawat Puja", start: '2025-10-23', end: '2025-10-23' },
    { name: "Chhath Puja", start: '2025-10-25', end: '2025-10-28' },
    { name: "Guru Nanak's Birthday/Kartik Purnima", start: '2025-11-05', end: '2025-11-05' },
    { name: "Bhagwan Birsa Jayanti", start: '2025-11-15', end: '2025-11-15' },
    { name: "Christmas Holiday & Winter Vacation", start: '2025-12-24', end: '2025-12-31' },
    // Half Day and Sectional Holidays
    { name: "Makar Sankranti$", start: '2025-01-14', end: '2025-01-14', symbol: '$' },
    { name: "Chaitra Sankranti", start: '2025-04-13', end: '2025-04-13' },
    { name: "Easter Monday^", start: '2025-04-21', end: '2025-04-21', symbol: '^' },
    { name: "Raksha Bandhan", start: '2025-08-09', end: '2025-08-09' },
    { name: "Chehallum^", start: '2025-08-14', end: '2025-08-14', symbol: '^' },
    { name: "Anant Chaturdashi$", start: '2025-09-06', end: '2025-09-06', symbol: '$' },
    { name: "Mahalaya", start: '2025-09-21', end: '2025-09-21' },
  ], []);

  // Build courtHolidays for day highlighting
  const courtHolidays = useMemo(() => {
    const holidays = {};
    
    holidayEvents.forEach(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const current = new Date(start);
      
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        holidays[dateStr] = { 
          name: event.name, 
          isRange: event.start !== event.end,
          start: event.start,
          end: event.end,
          symbol: event.symbol
        };
        current.setDate(current.getDate() + 1);
      }
    });
    
    return holidays;
  }, [holidayEvents]);

  // Handle day press with route check
  const handleDayPress = useCallback((day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    console.log("Selected date:", dateString);
    
    if (isCalendarRoute) {
      setShowDateDetails(true);
    }
  }, [isCalendarRoute]);

  // Get details for the selected date using IST
  const getDateDetails = useCallback(() => {
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();
    const isSunday = dayOfWeek === 0;
    
    // Calculate if it's the second Saturday of the month
    const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const firstDay = firstDayOfMonth.getDay();
    const daysToFirstSaturday = (6 - firstDay + 7) % 7;
    const firstSaturdayDate = 1 + daysToFirstSaturday;
    const secondSaturdayDate = firstSaturdayDate + 7;
    const isSecondSaturday = dateObj.getDate() === secondSaturdayDate;

    const holidayInfo = courtHolidays[selectedDate];
    const isRegularSaturday = dayOfWeek === 6 && !isSecondSaturday;
    const isToday = todayIST === selectedDate;

    // Determine day type with special handling for restricted holidays
    let dayType;
    if (isSunday) {
      dayType = "Sunday";
    } else if (isSecondSaturday) {
      dayType = "Second Saturday";
    } else if (holidayInfo) {
      if (holidayInfo.symbol === '^') {
        dayType = "Restricted Holiday";
      } else {
        dayType = "Holiday";
      }
    } else if (isRegularSaturday) {
      dayType = "Regular Saturday";
    } else {
      dayType = "Working Day";
    }
    
    return {
      date: selectedDate,
      dayType,
      holidayInfo,
      isToday,
      isSunday,
      isSecondSaturday
    };
  }, [selectedDate, courtHolidays, todayIST]);

  // Custom day component with consistent rounded corners
  const CustomDay = (props) => {
    const { date, state } = props;
    const dateStr = date.dateString;
    const dateObj = new Date(date.timestamp);
    const dayOfWeek = dateObj.getDay();
    const isSunday = dayOfWeek === 0;
    
    // Calculate if it's the second Saturday of the month
    const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const firstDay = firstDayOfMonth.getDay();
    const daysToFirstSaturday = (6 - firstDay + 7) % 7;
    const firstSaturdayDate = 1 + daysToFirstSaturday;
    const secondSaturdayDate = firstSaturdayDate + 7;
    const isSecondSaturday = date.day === secondSaturdayDate;

    const isToday = todayIST === dateStr;
    const holidayInfo = courtHolidays[dateStr];
    const isRegularSaturday = dayOfWeek === 6 && !isSecondSaturday;

    // Check if it's a restricted holiday (symbol: ^)
    const isRestrictedHoliday = holidayInfo && holidayInfo.symbol === '^';
    
    let dayStyle = {};
    let textStyle = { color: colors.text };

    // Today's date - yellow background
    if (isToday) {
      dayStyle = {
        backgroundColor: '#FFD700',
        borderRadius: 18,
      };
      textStyle = { color: '#000', fontWeight: 'bold' };
    } 
    // Sundays - red background with rounded corners
    else if (isSunday) {
      dayStyle = {
        backgroundColor: '#f62c2cee',
        borderRadius: 18,
      };
    } 
    // Second Saturdays & Holidays (excluding restricted holidays) - red background
    else if (isSecondSaturday || (holidayInfo && !isRestrictedHoliday)) {
      dayStyle = {
        backgroundColor: '#f62c2cee',
        borderRadius: 18,
      };
    }
    // Regular Saturdays - green background
    else if (isRegularSaturday) {
      dayStyle = {
        backgroundColor: '#37b937ff',
        borderRadius: 18,
      };
    }

    return (
      <TouchableOpacity 
        onPress={() => handleDayPress(date)}
        style={[styles.dayContainer, dayStyle]}
      >
        <Text style={[styles.dayText, textStyle]}>{date.day}</Text>
      </TouchableOpacity>
    );
  };

  // Custom calendar theme
  const calendarTheme = {
    backgroundColor: colors.background,
    calendarBackground: colors.card,
    textSectionTitleColor: colors.text,
    selectedDayBackgroundColor: colors.highlight,
    selectedDayTextColor: '#ffffff',
    todayTextColor: colors.highlight,
    dayTextColor: colors.text,
    textDisabledColor: colors.secText,
    arrowColor: colors.text,
    monthTextColor: colors.text,
    indicatorColor: colors.highlight,
    'stylesheet.calendar.header': {
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
        marginTop: 15,
        paddingTop: 10,
      },
      monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 5,
      },
      dayHeader: {
        width: 32,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 10,
      },
    },
  };

  // Format date range for display
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (start === end) {
      return startDate.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric'
      });
    }
    
    return `${startDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    })} - ${endDate.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    })}`;
  };

  // Get symbol explanation
  const getSymbolExplanation = (symbol) => {
    switch(symbol) {
      case '*': return "Date may change according to moon visibility";
      case '$': return "Half day holiday";
      case '^': return "Restricted holiday (not a court holiday)";
      default: return "";
    }
  };
  const formattedCurrentDate = useMemo(() => {
    const dateObj = new Date(todayIST + 'T00:00:00+05:30');
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [todayIST]);

  // Get details for the selected date
  const dateDetails = getDateDetails();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navbar />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Header */}
        <HeadingText
          icon="calendar-month"
          heading="High Court Calendar 2025"
          subHeading={`Current Date: ${formattedCurrentDate}`}
        />

        {/* Important Notes */}
        <View style={[styles.notesContainer, { 
          backgroundColor: colors.card,
          }]}>
          <Text style={[styles.noteTitle, { color: colors.text }]}>Important Notes:</Text>
          <View style={styles.noteItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#f62c2cee' }]} />
            <Text style={[styles.noteText, { color: colors.text }]}>Sundays, Second Saturdays & Holidays</Text>
          </View>
          <View style={styles.noteItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#37b937ff' }]} />
            <Text style={[styles.noteText, { color: colors.text }]}>Regular Saturdays</Text>
          </View>
          <View style={styles.noteItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#FFD700' }]} />
            <Text style={[styles.noteText, { color: colors.text }]}>Today's Date</Text>
          </View>
        </View>

        {/* Calendar Component */}
        <View style={[styles.calendarContainer, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : colors.secText,
        }]}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDayPress}
            theme={calendarTheme}
            firstDay={1}
            hideExtraDays
            enableSwipeMonths
            dayComponent={CustomDay}
          />
        </View>

        {/* Selected Date Preview */}
        <TouchableOpacity 
          onPress={() => {
            if (isCalendarRoute) {
              setShowDateDetails(true);
            } else {
              console.log("Preview pressed for date:", selectedDate);
            }
          }}
          style={[styles.datePreview, { backgroundColor: colors.card }]}
        >
          <View>
            <Text style={[styles.selectedDateText, { color: colors.text }]}>
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <Text style={[styles.dateType, { 
              color: dateDetails.dayType === "Working Day" || 
                     dateDetails.dayType === "Restricted Holiday" ? 
                     colors.secText : colors.highlight 
            }]}>
              {dateDetails.dayType}
            </Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color={colors.secText} 
          />
        </TouchableOpacity>
        {/* Symbol Explanations */}
        <View style={[styles.notesContainer2, { 
          backgroundColor: colors.card,
        }]}>
          <View style={styles.symbolSection}>
            <View style={styles.symbolItem}>
              <Text style={[styles.symbolText, { color: colors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>* </Text>
                Date may change according to moon visibility
              </Text>
            </View>
            <View style={styles.symbolItem}>
              <Text style={[styles.symbolText, { color: colors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>$ </Text>
                Half day holiday
              </Text>
            </View>
            <View style={styles.symbolItem}>
              <Text style={[styles.symbolText, { color: colors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>^ </Text>
                Restricted holiday (not a court holiday)
              </Text>
            </View>
          </View>
          </View>
      </ScrollView>

      {/* Date Details Modal (only shown when in calendar route) */}
      {isCalendarRoute && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDateDetails}
          onRequestClose={() => setShowDateDetails(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowDateDetails(false)}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
              
              <View style={[
                styles.dateTypeBadge, 
                { backgroundColor: dateDetails.dayType === "Restricted Holiday" ? '#5f5fcd' : '#5f27cd' }
              ]}>
                <Text style={[styles.dateTypeText, { color: '#fff' }]}>
                  {dateDetails.dayType}
                </Text>
              </View>
              
              {dateDetails.holidayInfo && (
                <View>
                  <View style={styles.holidayDetails}>
                    <MaterialCommunityIcons 
                      name="calendar-star" 
                      size={28} 
                      color={colors.highlight} 
                    />
                    <View style={styles.holidayInfo}>
                      <Text style={[styles.holidayName, { color: colors.text }]}>
                        {dateDetails.holidayInfo.name}
                      </Text>
                      {dateDetails.holidayInfo.isRange && (
                        <Text style={[styles.holidayDateRange, { color: colors.secText }]}>
                          {formatDateRange(
                            dateDetails.holidayInfo.start, 
                            dateDetails.holidayInfo.end
                          )}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  {dateDetails.holidayInfo.symbol && (
                    <View style={styles.symbolExplanation}>
                      <Text style={[styles.symbolLabel, { color: colors.text }]}>
                        Symbol Explanation:
                      </Text>
                      <Text style={[styles.symbolText, { color: colors.secText }]}>
                        {getSymbolExplanation(dateDetails.holidayInfo.symbol)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              <View style={styles.dayInfo}>
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.secText }]}>Day of Week:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.secText }]}>Date:</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {selectedDate}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.secText }]}>Status:</Text>
                  <Text style={[styles.infoValue, { 
                    color: dateDetails.dayType === "Working Day" || 
                           dateDetails.dayType === "Restricted Holiday" ? 
                           colors.secText : colors.highlight 
                  }]}>
                    {dateDetails.dayType}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const getStyles = (colors, isDark) =>
  StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  notesContainer: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notesContainer2: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 30,
    marginRight: 12,
  },
  noteText: {
    fontSize: 14,
  },
  symbolSection: {
    // marginTop: 15,
    // borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 10,
  },
  symbolTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  symbolItem: {
    marginBottom: 6,
  },
  symbolText: {
    fontSize: 14,
  },
  calendarContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  dayContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  datePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    marginTop: 2,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateType: {
    fontSize: 15,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: height * 0.85,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
  },
  dateTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  dateTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  holidayDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(106, 90, 205, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  holidayInfo: {
    marginLeft: 15,
    flex: 1,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  holidayDateRange: {
    fontSize: 15,
  },
  symbolExplanation: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  symbolLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  symbolText: {
    fontSize: 14,
  },
  dayInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 20,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CalendarPage;