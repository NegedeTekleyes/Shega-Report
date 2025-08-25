import { Alert, Linking, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/providers/auth-providers'
import { useLanguage } from '@/providers/language-providers'
import { useTheme } from '@/providers/theme-provider'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Define types for our settings items
interface SettingsItem {
  icon: string;
  label: string;
  type: 'switch' | 'action';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingScreen() {
    const { user, logout } = useAuth()
    const { language, changeLanguage } = useLanguage()
    const { theme, setThemeMode } = useTheme()
    
    const [settings, setSettings] = useState({
        notifications: true,
        locationServices: true,
        dataSaver: false,
        autoUpdate: true
    })

    const handleLogout = () => {
        Alert.alert(
            language === 'en' ? 'Logout' : 'ውጣ',
            language === 'en' ? 'Are you sure you want to logout?' : 'እርግጠኛ ነዎት መውጣት ይፈልጋሉ?',
            [
                { 
                    text: language === 'en' ? 'Cancel' : 'ሰርዝ', 
                    style: 'cancel' 
                },
                { 
                    text: language === 'en' ? 'Logout' : 'ውጣ', 
                    onPress: () => {
                        logout()
                        router.replace('/(auth)/login')
                    }
                }
            ]
        )
    }

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@shegareport.com')
    }

    const handleRateApp = () => {
        Alert.alert(
            language === 'en' ? 'Rate App' : 'መተግበሪያውን ደረጅ ይግለጹ',
            language === 'en' ? 'Thank you for using ShegaReport!' : 'ሸጋሪፖርት ስለተጠቀሙ አመሰግናለሁ!'
        )
    }

    const copyAppVersion = async () => {
        Alert.alert(
            language === 'en' ? 'App Version' : 'የመተግበሪያ ስሪት',
            'ShegaReport v1.0.0',
            [{ text: language === 'en' ? 'OK' : 'እሺ' }]
        )
    }

    const settingsSections: SettingsSection[] = [
        {
            title: language === 'en' ? 'Preferences' : 'ምርጫዎች',
            items: [
                {
                    icon: 'notifications',
                    label: language === 'en' ? 'Notifications' : 'ማስታወቂያዎች',
                    type: 'switch',
                    value: settings.notifications,
                    onValueChange: (value) => setSettings(prev => ({ ...prev, notifications: value }))
                },
                {
                    icon: 'language',
                    label: language === 'en' ? 'Language' : 'ቋንቋ',
                    type: 'action',
                    onPress: () => changeLanguage(language === 'en' ? 'am' : 'en')
                },
                {
                    icon: 'moon',
                    label: language === 'en' ? 'Dark Mode' : 'ጨለማ ሞድ',
                    type: 'switch',
                    value: theme.isDark,
                    onValueChange: (value) => setThemeMode(value)
                }
            ]
        },
        {
            title: language === 'en' ? 'Privacy & Security' : 'ግላዊነት እና ደህንነት',
            items: [
                {
                    icon: 'lock-closed',
                    label: language === 'en' ? 'Privacy Policy' : 'የግላዊነት ፖሊሲ',
                    type: 'action',
                    onPress: () => router.push('/privacys')
                },
                {
                    icon: 'shield-checkmark',
                    label: language === 'en' ? 'Terms of Service' : 'የአገልግሎት ውሎች',
                    type: 'action',
                    onPress: () => router.push('/terms')
                },
                {
                    icon: 'location',
                    label: language === 'en' ? 'Location Services' : 'የአካባቢ አገልግሎቶች',
                    type: 'switch',
                    value: settings.locationServices,
                    onValueChange: (value) => setSettings(prev => ({ ...prev, locationServices: value }))
                }
            ]
        },
        {
            title: language === 'en' ? 'Support' : 'ድጋፍ',
            items: [
                {
                    icon: 'help-circle',
                    label: language === 'en' ? 'Help Center' : 'የእርዳታ ማዕከል',
                    type: 'action',
                    onPress: () => router.push('/help')
                },
                {
                    icon: 'chatbubble-ellipses',
                    label: language === 'en' ? 'Contact Support' : 'ድጋፍ ያግኙ',
                    type: 'action',
                    onPress: handleContactSupport
                },
                {
                    icon: 'document-text',
                    label: language === 'en' ? 'Report a Problem' : 'ችግር ይግለጹ',
                    type: 'action',
                    onPress: () => router.push('/reports')
                }
            ]
        },
        {
            title: language === 'en' ? 'About' : 'ስለ',
            items: [
                {
                    icon: 'information',
                    label: language === 'en' ? 'About App' : 'ስለ መተግበሪያው',
                    type: 'action',
                    onPress: () => router.push('/(modals)/about')
                },
                {
                    icon: 'star',
                    label: language === 'en' ? 'Rate App' : 'መተግበሪያውን ደረጅ ይግለጹ',
                    type: 'action',
                    onPress: handleRateApp
                },
                {
                    icon: 'share-social',
                    label: language === 'en' ? 'Share App' : 'መተግበሪያውን አጋራ',
                    type: 'action',
                    onPress: () => Alert.alert(
                        language === 'en' ? 'Share' : 'አጋራ', 
                        language === 'en' ? 'Sharing feature coming soon!' : 'የማጋራት ባህሪ በቅርብ ጊዜ ይመጣል!'
                    )
                }
            ]
        }
    ]

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View style={{ 
                paddingHorizontal: 24, 
                paddingTop: 48, 
                paddingBottom: 16, 
                backgroundColor: theme.isDark ? '#1F2937' : '#10B981' 
            }}>
                <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: 'white' 
                }}>
                    {language === 'en' ? 'Settings' : 'ቅንብሮች'}
                </Text>
                <Text style={{ 
                    color: theme.isDark ? '#D1D5DB' : '#D1FAE5',
                    fontSize: 14
                }}>
                    {language === 'en' ? 'Customize your experience' : 'ተሞክሮዎን ያብጁ'}
                </Text>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
                {/* Account Section */}
                <View style={{ 
                    borderRadius: 12, 
                    padding: 16, 
                    marginTop: 16, 
                    backgroundColor: theme.colors.card 
                }}>
                    <Text style={{ 
                        fontSize: 18, 
                        fontWeight: '600', 
                        marginBottom: 12,
                        color: theme.colors.text 
                    }}>
                        {language === 'en' ? 'Account' : 'መለያ'}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ 
                            width: 48, 
                            height: 48, 
                            backgroundColor: '#D1FAE5', 
                            borderRadius: 24, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginRight: 12
                        }}>
                            <Text style={{ color: '#059669', fontSize: 18, fontWeight: 'bold' }}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ 
                                fontWeight: '600',
                                color: theme.colors.text 
                            }}>
                                {user?.name}
                            </Text>
                            <Text style={{ 
                                fontSize: 14,
                                color: theme.colors.textSecondary 
                            }}>
                                {user?.email}
                            </Text>
                            <Text style={{ 
                                fontSize: 12, 
                                textTransform: 'capitalize',
                                color: theme.colors.textSecondary 
                            }}>
                                {user?.role}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            paddingVertical: 12,
                            borderTopWidth: 1,
                            borderTopColor: theme.colors.border
                        }}
                        onPress={handleLogout}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="log-out" size={20} color="#EF4444" />
                            <Text style={{ color: '#EF4444', marginLeft: 12 }}>
                                {language === 'en' ? 'Logout' : 'ውጣ'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Settings Sections */}
                {settingsSections.map((section, sectionIndex) => (
                    <View 
                        key={sectionIndex} 
                        style={{ 
                            borderRadius: 12, 
                            padding: 16, 
                            marginTop: 16, 
                            backgroundColor: theme.colors.card 
                        }}
                    >
                        <Text style={{ 
                            fontSize: 18, 
                            fontWeight: '600', 
                            marginBottom: 16,
                            color: theme.colors.text 
                        }}>
                            {section.title}
                        </Text>
                        
                        {section.items.map((item, itemIndex) => (
                            <TouchableOpacity
                                key={itemIndex}
                                style={{ 
                                    flexDirection: 'row', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    paddingVertical: 12,
                                    borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                                    borderBottomColor: theme.colors.border
                                }}
                                onPress={item.onPress}
                                disabled={item.type === 'switch'}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Ionicons 
                                        name={item.icon as any} 
                                        size={20} 
                                        color={theme.colors.textSecondary} 
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text style={{ 
                                        flex: 1,
                                        color: theme.colors.text 
                                    }}>
                                        {item.label}
                                    </Text>
                                </View>

                                {item.type === 'switch' ? (
                                    <Switch
                                        value={item.value}
                                        onValueChange={item.onValueChange}
                                        trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                                    />
                                ) : (
                                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* App Version */}
                <TouchableOpacity onPress={copyAppVersion} style={{ alignItems: 'center', marginTop: 24 }}>
                    <Text style={{ 
                        fontSize: 14,
                        color: theme.colors.textSecondary 
                    }}>
                        ShegaReport v1.0.0
                    </Text>
                    <Text style={{ 
                        fontSize: 12, 
                        marginTop: 4,
                        marginBottom: 8,
                        color: theme.colors.textSecondary 
                    }}>
                        {language === 'en' 
                            ? 'Serving Debre Birhan Community'
                            : 'ለደብረ ብርሃን ማህበረሰብ አገልግሎት'
                        }
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}