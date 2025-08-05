import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../Context/ThemeContext'; // ✅ Import theme hook

const { width: screenWidth } = Dimensions.get('window');

const CustomDropdown = ({
  data = [],
  value,
  onSelect,
  placeholder = "Select an option",
  searchPlaceholder = "Search",
  title = "Select Option",
  disabled = false,
  loading = false,
  style,
  searchable = true,
  renderItem: customRenderItem,
}) => {
  const { isDark, colors } = useTheme(); // ✅ Use theme context
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedItem = data.find(item => item.value === value);
  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (item) => {
    onSelect(item);
    setModalVisible(false);
    setSearchText('');
  };

  const openModal = () => {
    if (!disabled && !loading && data.length > 0) {
      setModalVisible(true);
    }
  };

  const defaultRenderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        { backgroundColor: colors.background, borderBottomColor: colors.border },
        index === filteredData.length - 1 && styles.lastItem
      ]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.6}
    >
      <Text style={[styles.listItemText, { color: colors.text }]} numberOfLines={2}>
        {item.label}
      </Text>
      {value === item.value && (
        <Ionicons name="checkmark" size={20} color={colors.text} />
      )}
    </TouchableOpacity>
  );

  const renderItemComponent = customRenderItem || defaultRenderItem;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dropdownTrigger,
          { backgroundColor: colors.card, borderColor: colors.border },
          disabled && styles.triggerDisabled,
          style
        ]}
        onPress={openModal}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.triggerText,
                { color: selectedItem ? colors.text : '#8E8E93' }
              ]}
              numberOfLines={1}
            >
              {selectedItem ? selectedItem.label : placeholder}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={disabled ? "#C7C7CC" : "#8E8E93"}
              style={styles.chevron}
            />
          </>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "fullScreen"}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.navBar, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.cancelText, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.navTitle, { color: colors.text }]}>{title}</Text>
            <View style={styles.navButton} />
          </View>

          {searchable && (
            <View style={[styles.searchBarContainer, { backgroundColor: colors.background }]}>
              <View style={[styles.searchBar, { backgroundColor: isDark ? '#2c2c2e' : '#E9E9EA' }]}>
                <Ionicons name="search" size={16} color="#8E8E93" />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#8E8E93"
                  value={searchText}
                  onChangeText={setSearchText}
                  returnKeyType="search"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')}>
                    <Ionicons name="close-circle-outline" size={16} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <FlatList
            data={filteredData}
            renderItem={renderItemComponent}
            keyExtractor={(item) => item.value?.toString() || item.label}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  {searchText ? 'No results found' : 'No options available'}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownTrigger: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.04,
        shadowRadius: 0,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  triggerText: {
    fontSize: 17,
    flex: 1,
    fontWeight: '400',
  },
  chevron: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 17,
  },
  modalContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 16,
  },
  navButton: {
    minWidth: 60,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    marginLeft: 8,
    marginRight: 8,
    paddingVertical: 6,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  listItemText: {
    fontSize: 17,
    flex: 1,
    marginRight: 16,
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
  },
});

export default CustomDropdown;
