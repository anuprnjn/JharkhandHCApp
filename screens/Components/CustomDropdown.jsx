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
        index === filteredData.length - 1 && styles.lastItem
      ]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.6}
    >
      <Text style={styles.listItemText} numberOfLines={2}>
        {item.label}
      </Text>
      {value === item.value && (
        <Ionicons name="checkmark" size={20} color="#4B3E2F" />
      )}
    </TouchableOpacity>
  );

  const renderItemComponent = customRenderItem || defaultRenderItem;

  return (
    <>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        style={[
          styles.dropdownTrigger,
          disabled && styles.triggerDisabled,
          style
        ]}
        onPress={openModal}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            <Text style={[
              styles.triggerText,
              !selectedItem && styles.placeholderText
            ]} numberOfLines={1}>
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

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        presentationStyle={Platform.OS === 'ios' ? "pageSheet" : "fullScreen"}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.navTitle}>{title}</Text>
            <View style={styles.navButton} />
          </View>

          {/* Search Bar */}
          {searchable && (
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color="#8E8E93" />
                <TextInput
                  style={styles.searchInput}
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

          {/* List */}
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
                <Text style={styles.emptyText}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
    borderColor: '#C7C7CC',
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
    backgroundColor: '#F2F2F7',
    opacity: 0.6,
  },
  triggerText: {
    fontSize: 17,
    color: '#000000',
    flex: 1,
    fontWeight: '400',
  },
  placeholderText: {
    color: '#8E8E93',
  },
  chevron: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 17,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 20,
    paddingBottom: 16,
    backgroundColor: '#ffffffff'
  },
  navButton: {
    minWidth: 60,
  },
  cancelText: {
    color: '#4B3E2F',
    fontSize: 17,
    fontWeight: '600',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },

  // Search Bar
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#E9E9EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    marginLeft: 8,
    marginRight: 8,
    paddingVertical: 6
  },

  // List Styles
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C7C7CC',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  listItemText: {
    fontSize: 17,
    color: '#000000',
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
    color: '#8E8E93',
  },
});

export default CustomDropdown;