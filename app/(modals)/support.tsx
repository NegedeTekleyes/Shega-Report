import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/providers/theme-provider'

export default function SupportScreen() {
  const { theme } = useTheme()

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@shegareport.com?subject=Support Request')
  }

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890')
  }

  const openFAQ = () => {
    // Would typically navigate to FAQ screen
    Linking.openURL('https://shegareport.com/faq')
  }

  const openHelpCenter = () => {
    // Would typically navigate to Help Center
    Linking.openURL('https://shegareport.com/help')
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Support</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          We're here to help you
        </Text>
      </View>

      {/* Contact Methods */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Us</Text>
        
        <TouchableOpacity 
          style={[styles.contactOption, { borderBottomColor: theme.colors.border }]}
          onPress={handleEmailSupport}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="mail" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.contactText}>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Email Support</Text>
            <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
              Get help via email
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.contactOption, { borderBottomColor: theme.colors.border }]}
          onPress={handleCallSupport}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="call" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.contactText}>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Call Support</Text>
            <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
              +1 (234) 567-890
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactOption}
          onPress={openFAQ}
        >
          <View style={styles.contactIcon}>
            <Ionicons name="help-circle" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.contactText}>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>FAQ</Text>
            <Text style={[styles.contactDescription, { color: theme.colors.textSecondary }]}>
              Frequently asked questions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Help Resources */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Help Resources</Text>
        
        <TouchableOpacity 
          style={[styles.resourceOption, { borderBottomColor: theme.colors.border }]}
          onPress={openHelpCenter}
        >
          <View style={styles.resourceIcon}>
            <Ionicons name="book" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.resourceText, { color: theme.colors.text }]}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.resourceOption, { borderBottomColor: theme.colors.border }]}
          onPress={() => Linking.openURL('https://shegareport.com/guides')}
        >
          <View style={styles.resourceIcon}>
            <Ionicons name="document-text" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.resourceText, { color: theme.colors.text }]}>User Guides</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resourceOption}
          onPress={() => Linking.openURL('https://shegareport.com/community')}
        >
          <View style={styles.resourceIcon}>
            <Ionicons name="people" size={24} color={theme.colors.primary} />
          </View>
          <Text style={[styles.resourceText, { color: theme.colors.text }]}>Community Forum</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Emergency Contact */}
      <View style={[styles.emergencySection, { backgroundColor: '#FEF2F2' }]}>
        <Ionicons name="warning" size={24} color="#DC2626" />
        <Text style={styles.emergencyTitle}>Emergency Support</Text>
        <Text style={styles.emergencyText}>
          For urgent issues that require immediate attention outside of business hours
        </Text>
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => Linking.openURL('tel:+990')}
        >
          <Text style={styles.emergencyButtonText}>Call Emergency Line</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  section: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  contactIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
  },
  resourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  resourceIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  resourceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  hoursContainer: {
    marginTop: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  hoursDay: {
    fontSize: 16,
  },
  hoursTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  emergencySection: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})