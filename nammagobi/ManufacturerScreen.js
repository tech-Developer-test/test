import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const manufacturerData = [
  {
    id: '1',
    image: 'https://via.placeholder.com/100',
    manufacturer: 'ABC Industries',
    product: 'Steel Rod',
    price: '₹5000',
    location: 'Delhi'
  },
  {
    id: '2',
    image: 'https://via.placeholder.com/100',
    manufacturer: 'XYZ Pvt Ltd',
    product: 'Aluminum Sheet',
    price: '₹7500',
    location: 'Mumbai'
  },
  // Add more items as needed
];

function ManufacturerScreen() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All');

  const filteredData = manufacturerData.filter(item =>
    item.product.toLowerCase().includes(search.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TextInput
          placeholder="Search products or manufacturers"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="location-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="filter-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* List of Manufacturer Cards */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.product}>{item.product}</Text>
              <Text style={styles.manufacturer}>{item.manufacturer}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  headerRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconButton: {
    marginLeft: 10,
    backgroundColor: '#eaf1ff',
    padding: 8,
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  cardContent: { flex: 1, marginLeft: 10 },
  product: { fontSize: 16, fontWeight: 'bold' },
  manufacturer: { fontSize: 14, color: '#555' },
  price: { fontSize: 15, color: '#007bff', marginTop: 4 },
  location: { fontSize: 12, color: '#777', marginTop: 2 },
});

export default ManufacturerScreen;
