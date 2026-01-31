import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

export default function ManageEventsScreen() {
  const [screen, setScreen] = useState<'home' | 'login' | 'signup' | 'events'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Login handler
  const handleLogin = () => {
    if (email && password) {
      setCoordinatorName(email.split('@')[0]);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
      setScreen('events');
    }
  };

  // Sign up handler
  const handleSignUp = () => {
    if (organizerName && email && password) {
      setCoordinatorName(organizerName);
      setIsLoggedIn(true);
      setOrganizerName('');
      setEmail('');
      setPassword('');
      setScreen('events');
    }
  };

  // Add event handler
  const handleAddEvent = () => {
    if (eventTitle && eventDate && eventLocation) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title: eventTitle,
          date: eventDate,
          location: eventLocation,
        },
      ]);
      setEventTitle('');
      setEventDate('');
      setEventLocation('');
      setShowAddEvent(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCoordinatorName('');
    setEvents([]);
    setScreen('home');
  };

  // Render My Events screen
  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Events</Text>
            <Text style={styles.headerSubtitle}>{coordinatorName}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddEvent(!showAddEvent)}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {showAddEvent && (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Create New Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={eventTitle}
              onChangeText={setEventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (e.g., Feb 15, 2025)"
              value={eventDate}
              onChangeText={setEventDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={eventLocation}
              onChangeText={setEventLocation}
            />
            <View style={styles.formButtonContainer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddEvent(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleAddEvent}>
                <Text style={styles.createBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No events yet</Text>
            <Text style={styles.emptySubtext}>Create your first event to get started</Text>
          </View>
        ) : (
          <ScrollView style={styles.eventsList}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Text style={styles.eventCardTitle}>{event.title}</Text>
                <View style={styles.eventCardDetail}>
                  <Ionicons name="calendar" size={14} color="#666" />
                  <Text style={styles.eventCardText}>{event.date}</Text>
                </View>
                <View style={styles.eventCardDetail}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.eventCardText}>{event.location}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#ff3b30" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Render Login screen
  if (screen === 'login') {
    return (
      <View style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.authTitle}>Log In</Text>
          <Text style={styles.authSubtitle}>Access your events</Text>

          <TextInput
            style={styles.authInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.authInput}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
            <Text style={styles.authButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen('signup')}>
            <Text style={styles.switchAuthLink}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Render Sign Up screen
  if (screen === 'signup') {
    return (
      <View style={styles.authContainer}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Sign up to manage your events</Text>

          <TextInput
            style={styles.authInput}
            placeholder="Organiser Name"
            value={organizerName}
            onChangeText={setOrganizerName}
          />

          <TextInput
            style={styles.authInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.authInput}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.authButton} onPress={handleSignUp}>
            <Text style={styles.authButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen('login')}>
            <Text style={styles.switchAuthLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Render Home screen
  return (
    <View style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <View style={styles.homeContent}>
          <Text style={styles.authTitle}>Manage Events</Text>
          <Text style={styles.authSubtitle}>Sign in to coordinate events</Text>

          <View style={styles.homeButtonContainer}>
            <TouchableOpacity style={styles.authButton} onPress={() => setScreen('login')}>
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={() => setScreen('signup')}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  homeContent: {
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  // Auth screens
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  authInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthLink: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
  },
  homeButtonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  // My Events
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  formButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventsList: {
    flex: 1,
    padding: 15,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  eventCardText: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
